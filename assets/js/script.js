// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));


// Element List / DOM Elements
const taskFormEl = $('.taskform');
const taskTitle = $('#task-title');
const taskDueDate = $('#task-due-date');
const taskDetail = $('#task-detail');


// Creating The Task Card Element
function createTaskCard(task) {

  const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);

  // The structure 
  const cardHeader = $('<div>').addClass('card-header h4').text(task.taskTitle);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(taskDetail.type);

  // Due Date
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);

  // Delete / Cancel Button
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteTask);

  // Background Color sorter for nearing due date
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

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
  const tasks = readTasksFromStorage();

  // Emptying existing project cards from the columns
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  //Loop Function through the tasks and create task cards for each status (if able)
  for (let task of tasks) {
    if (task.status === '#to-do') {
      todoList.append(createTaskCard(task));
    } else if (project.status === '#in-progress') {
      inProgressList.append(createTaskCard(task));
    } else if (project.status === '#done') {
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
function handleAddTask(event){
  event.preventDefault();

  const taskName = taskTitle.val().trim();
  const taskDetails = taskDetail.val().trim();
  // YYY-MM-DD format
  const taskDate = taskDueDate.val();
  
  const newTask = {
    name: taskName,
    details: taskDetails,
    taskDate: taskDate,
    status: 'to-do'
  }

  // Pulls tasks from localStorage to push to the new array
  const tasks = readTasksFromStorage();
  tasks.push(newTask);

  // Save updated tasks to localStorage
  saveTasksToStorage(tasks);

  // Prints the task data on the screen
  printTaskData();

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
  saveProjectsToStorage(task);
  printProjectData();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const tasks = readTasksFromStorage();
  const 
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});


