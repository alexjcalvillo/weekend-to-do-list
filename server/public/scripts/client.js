$(document).ready(init);

function init() {
  console.log('Client.js ');
  $('#js-btn-addTask').on('click', addTaskField);
  $('.js-taskInputField').on('click', 'button.js-postTask', postTask);
  $('#js-tasksDisplay').on('click', '#js-btn-deleteTask', deleteTask);
  $('#js-tasksDisplay').on(
    'click',
    '#js-btn-completeTask',
    clickedCompleteTask
  );
  $('.js-taskInputField').on('click', '.js-btn-cancelAdd', cancelAdd);

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
    <button class="js-postTask btn btn-primary">Add Task</button>
    <button class="js-btn-cancelAdd">X</button>
    `);
  $('#js-btn-addTask').attr('disabled', true);
  // <input type="complete" id="js-completeInput" placeholder="Complete" />
}

function cancelAdd() {
  console.log('in cancelAdd');
  $('.js-taskInputField').empty();
}

function clickedCompleteTask() {
  console.log('in clickedCompleteTask');
  const id = $(this).data('id');
  console.log(id);
  const statusNow = $(this).data('status');
  console.log(statusNow);
  completeTask(id, statusNow);
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
      updateRender(response);
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
      $('#js-btn-addTask').attr('disabled', false);
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

function completeTask(id, statusNow) {
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
    let status = null;
    if (task.status === false) {
      status = 'incomplete';
    } else {
      status = 'complete';
    }
    $('#js-tasksDisplay').append(`
        <tr class="${task.status} text-muted pt-3" data-status="${task.status}">
            <th scope="row">
            <svg
                width="1.5em"
                height="1.5em"
                viewBox="0 0 16 16"
                class="bi bi-bookmark"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
            <path
                fill-rule="evenodd"
                d="M8 12l5 3V3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12l5-3zm-4 1.234l4-2.4 4 2.4V3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10.234z"
            />
            </svg>
            </th>
            <td>
            <strong class="d-block font-weight-bold text-gray-dark">${task.task}</strong>
                <p class="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                    Task notes: ${task.notes}
                </p>
            </td>
            <td>
                ${status}
            </td>
            <td class="buttons">
                <button class="btn btn-primary" data-id="${task.id}" id="js-btn-deleteTask">Delete</button>
                <button class="btn btn-primary" data-id="${task.id}" data-status="${task.status}" id="js-btn-completeTask">Complete</button>
            </td>
        </tr>
        `);
    // const $row = $('#js-tasksDisplay').children(`.${task.status}`);
    // const rowStatus = $row.data('status');
    // if (rowStatus === true) {
    //   $('#js-tasksDisplay').children(`.${task.status}`).addClass('green');
    // }
  }
}

function resetInputs() {
  $('.js-taskInputField').empty();
}

function updateRender(tasks) {
  for (let task of tasks) {
    const $row = $('#js-tasksDisplay').children(`.${task.status}`);
    const rowStatus = $row.data('status');
    if (rowStatus === true) {
      $row.addClass('green');
      $row.children('.buttons').children().remove('#js-btn-completeTask');
    }
  }
}
