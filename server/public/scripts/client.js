$(document).ready(init);

function init() {
  console.log('Client.js ');
  $('#js-btn-addTask').on('click', addTaskField);
  $('#js-taskInputField').on('click', '#js-postTask', postTask);
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
