// Element List / DOM Elements
const taskFormEl = $('#formModal');
const taskTitle = $('#task-title');
const taskDueDate = $('#task-due-date');
const taskDetail = $('#task-detail');



// localStorage
function readTaskFromStorage() {

  let tasks = JSON.parse(localStorage.getItem('tasks'));

  // ? If no tasks were retrieved from localStorage, assign tasks to a new empty array to push to later.
  if (!tasks) {
    tasks = [];
  }

  return tasks;
}


// Accepts an array of tasks, stringifys them, and saves them in localStorage.
function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};



// Creating The Task Card Element
function createTaskCard(task) {

  const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);

  // The structure 
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.details);

  // Due Date
  const cardDueDate = $('<p>').addClass('card-text').text(task.taskDate);

  // Delete / Cancel Button
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  // Background Color sorter for nearing due date
  if (task.taskDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.taskDate, 'DD/MM/YYYY');

    // Near Due Task
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');

    // Over Due Task
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  // Appending the elements to the card
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  // Placing the card on the column that matches the corresponding staus
  return taskCard;
}



// Printing the card on the page.
function renderTaskList() {
  const tasks = readTaskFromStorage();

  // Emptying existing task cards from the columns
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  //Loop Function through the tasks and create task cards for each status (if able)
  for (let task of tasks) {
    if (task.status == 'to-do') {
      todoList.append(createTaskCard(task));
    } else if (task.status == 'in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (task.status == 'done') {
      doneList.append(createTaskCard(task));
    }
  }

  //JQuery Library to make the cards draggable
  $('.draggable').draggable({
    opacity: 0.7,
    zIndex: 100,

    // A 'Ghost' of the card to show where you are dragging the card to the next area
    helper: function (e) {
      // To check if the target of the drag event is the card or the child element - and then if not the card it will target the parent card element
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');

      // to return the clone with the set width so that it does not take up the whole and to fix 
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}


// Adding a New Task
function handleAddTask(){

  const taskName = taskTitle.val().trim();
  const taskDetails = taskDetail.val().trim();
  // YYY-MM-DD format
  const taskDate = taskDueDate.val();
  
  const newTask = {
    name: taskName,
    details: taskDetails,
    taskDate: taskDate,
    status: 'to-do',
    id: crypto.randomUUID(),
  }

  // Pulls tasks from localStorage to push to the new array
  const tasks = readTaskFromStorage();
  tasks.push(newTask);

  // Save updated tasks to localStorage
  saveTasksToStorage(tasks);

  // Prints the task data on the screen
  renderTaskList();

  // This is to clear the form inputs
  taskTitle.val("");
  taskDetail.val("");
  taskDueDate.val("");
};



// To Delete a Task
function handleDeleteTask() {
  const taskId = $(this).attr('data-task-id');
  const tasks = readTaskFromStorage();

  //loop over array
  tasks.forEach((task, i) => {
    if (task.id == taskId) {
      tasks.splice(i, 1);
    }
  });

  // to save the tasks to localStorage
  saveTasksToStorage(tasks);
  renderTaskList();
}



// Dropping the Tasks into the status columns
function handleDrop(event, ui) {
  const tasks = readTaskFromStorage();
  const taskId = ui.draggable[0].dataset.taskId;

  // The id of the column that the card was dropped into
  const newStatus = event.target.id;

  for (let task of tasks) {
    // Locating the task card by the `id` and update the task status.
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }
  // Saving the updated tasks array to localStorage (overwritting the previous one) and render the new task data to the screen.
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();
}

// Event Listener - Form
taskFormEl.on('click', '.save-btn', function(e) {
  e.preventDefault();

  handleAddTask();

  // Tells the modal to hide when the button is clicked
  taskFormEl.modal('hide');
})



// Event Listener - Task Columns
$('.swim-lanes').on('click', '.delete', handleDeleteTask);



// On page load:  rendered the task list, make columns droppable, and make the due date field a date picker
$(document).ready(function () {

  // Prints task data to the screen on page load if there is any
  renderTaskList();

  $('#task-due-date').datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // Make columns droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
});