$(document).ready(init);

function init() {
  console.log('Client.js ');
  $('#js-btn-addTask').on('click', addTaskField);
  $('.js-taskInputField').on('click', 'button.js-postTask', postTask);
  $('#js-tasksDisplay').on('click', '#js-btn-deleteTask', deleteTask);
  $('#js-tasksDisplay').on('click', '#js-btn-completeTask', completeTask);

  getTasks();
}
//
// EVENT LISTENERS
// ----------------
function addTaskField() {
  console.log('in addTaskField');
  $('.js-taskInputField').append(`
    <input type="text" id="js-taskInput" placeholder="Task" />
    <input type="text" id="js-notesInput" placeholder="Notes" />
    <button class="js-postTask">Add Task</button>
    `);
  // <input type="complete" id="js-completeInput" placeholder="Complete" />
}

//
// AJAX CALLS
// ----------
function getTasks() {
  console.log('GET');
  $.ajax({
    type: 'GET',
    url: '/api/tasks',
  })
    .then((response) => {
      console.log(response);
      renderTaskTable(response);
    })
    .catch((err) => {
      console.log("Something isn't right, ", err);
    });
}

function postTask() {
  console.log('in postTask');
  const task = $(this).parent().children('#js-taskInput').val();
  const notes = $(this).parent().children('#js-notesInput').val();
  //   const status = $(this).parent().children('#js-completeInput').val();

  $.ajax({
    type: 'POST',
    url: '/api/tasks',
    data: {
      task,
      notes,
      status: false,
    },
  })
    .then((response) => {
      console.log('POSTED - ', response);
      getTasks();
      resetInputs();
    })
    .catch((err) => {
      console.log("It didn't work. ", err);
    });
}

function deleteTask() {
  console.log('in deleteTask');
  const id = $(this).data('id');
  console.log(id);

  $.ajax({
    type: 'DELETE',
    url: `/api/tasks/${id}`,
  })
    .then((response) => {
      getTasks();
    })
    .catch((err) => {
      console.log('Oh no! ', err);
    });
}

function completeTask() {
  console.log('in completeTask');
  const id = $(this).data('id');
  console.log(id);
  const statusNow = $(this).data('status');
  console.log(statusNow);
  $.ajax({
    type: 'PUT',
    url: `/api/tasks/${id}`,
    data: {
      statusNow,
    },
  })
    .then((response) => {
      console.log('PUT', response);
      getTasks();
    })
    .catch((err) => {
      console.log('Nope - ', err);
    });
}

//
// RENDER
// -------
// TO DO:
function renderTaskTable(taskList) {
  $('#js-tasksDisplay').empty();
  for (let task of taskList) {
    $('#js-tasksDisplay').append(`
        <tr>
            <td>${task.task}</td>
            <td>${task.notes}</td>
            <td>${task.status}</td>
            <td>
                <button data-id="${task.id}" id="js-btn-deleteTask">Delete</button>
                <button data-id="${task.id}" data-status="${task.status}" id="js-btn-completeTask">Complete</button>
            </td>
        </tr>
        `);
  }
}

function resetInputs() {
  $('.js-taskInputField').empty();
}
