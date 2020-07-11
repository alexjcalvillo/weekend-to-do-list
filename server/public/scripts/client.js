$(document).ready(init);

function init() {
  console.log('Client.js ');
  $('#js-btn-addTask').on('click', addTaskField);
  $('#js-taskInputField').on('click', '#js-postTask', postTask);

  getTasks();
}
//
// EVENT LISTENERS
// ----------------
function addTaskField() {
  $('.js-taskInputField').append(`
    <input type="text" id="js-taskInput" placeholder="Task" />
    <input type="text" id="js-notesInput" placeholder="Notes" />
    <input type="complete" id="js-completeInput" placeholder="Complete" />
    <button id="js-postTask">Add Task</button>
    `);
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
  console.log('POST');
}

//
// RENDER
// -------
// TO DO:
function renderTaskTable(task) {
  $('#js-tasksDisplay').append(`
    <tr>
        <td>${task.task}</td>
        <td>${task.notes}</td>
        <td>${task.status}</td>
    `);
}
