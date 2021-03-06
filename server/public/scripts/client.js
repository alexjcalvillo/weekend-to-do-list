$(document).ready(init);

function init() {
  console.log('Client.js ');
  $('#js-btn-addTask').on('click', addTaskField);
  $('.js-taskInputField').on('click', 'button.js-postTask', postTask);
  $('#js-tasksDisplay').on('click', '#js-btn-deleteTask', clickDelete);
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
    <div class="container mx-auto" style="width: 800px;">
        <div class="row py-4 px-2 bg-light border border-primary">
            <div class="col-md-6">
            <p>This is where you input your tasks and notes pertaining to them!</p>
            </div>
            <div class="col-md-6">
                <input type="text" id="js-taskInput" style="min-width: 100%;" placeholder="Task" />
                <hr />
                <textarea type="text" id="js-notesInput" style="min-width: 100%;" placeholder="Notes"></textarea>
                <button class="js-postTask btn btn-primary">Add Task</button>
                <button class="js-btn-cancelAdd btn btn-primary">X</button>
            </div>
        </div>
    </div>
    `);
  $('#js-btn-addTask').attr('disabled', true);
  // <input type="complete" id="js-completeInput" placeholder="Complete" />
}

function cancelAdd() {
  console.log('in cancelAdd');
  $('.js-taskInputField').empty();
  $('#js-btn-addTask').attr('disabled', false);
}

function clickedCompleteTask() {
  console.log('in clickedCompleteTask');
  const id = $(this).data('id');
  console.log(id);
  const statusNow = $(this).data('status');
  console.log(statusNow);
  completeTask(id, statusNow);
}

function clickDelete() {
  const $target = $(this);
  swal({
    title: 'Are you sure?',
    text: 'Once deleted, you will not be able to recover this task!',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      deleteTask($target);
      swal(
        'Successfully deleted task! Way to check that off your list and outta the way.',
        {
          icon: 'success',
        }
      );
    } else {
      swal(
        "Just keep swimming, just keep swimming. You'll check this off soon enough!"
      );
    }
  });
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

function deleteTask(target) {
  console.log('in deleteTask');
  const id = target.data('id');
  console.log(id);

  $.ajax({
    type: 'DELETE',
    url: `/api/tasks/${id}`,
  })
    .then((response) => {
      getTasks();
      location.reload();
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
        <tr class="${task.status} text-muted pt-3" data-id="${task.id}" data-status="${task.status}">
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
            <button class="btn btn-danger" data-id="${task.id}" data-status="${task.status}" id="js-btn-deleteTask">Delete</button>

            <button class="btn btn-success" data-id="${task.id}" data-status="${task.status}" id="js-btn-completeTask">Complete</button>
            </td>
        </tr>
        `);
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
      $row.children('th').html(`
      <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-bookmark-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M4.5 2a.5.5 0 0 0-.5.5v11.066l4-2.667 4 2.667V8.5a.5.5 0 0 1 1 0v6.934l-5-3.333-5 3.333V2.5A1.5 1.5 0 0 1 4.5 1h4a.5.5 0 0 1 0 1h-4z"/>
  <path fill-rule="evenodd" d="M15.854 2.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 4.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
</svg>
      `);
    }
  }
}

// <button class="btn btn-danger" data-id="${task.id}" data-toggle="modal" data-target="#deleteModal">Delete</button>

//                 <!-- Modal -->
//                 <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModal" aria-hidden="true">
//                   <div class="modal-dialog modal-dialog-centered" role="document">
//                     <div class="modal-content">
//                       <div class="modal-header">
//                         <h5 class="modal-title" id="deleteModal">Delete Warning</h5>
//                         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//                           <span aria-hidden="true">&times;</span>
//                         </button>
//                       </div>
//                       <div class="modal-body">
//                         Are you sure you want to delete this task?
//                       </div>
//                       <div class="modal-footer">
//                         <button type="button" class="btn btn-secondary" data-dismiss="modal">No, cancel</button>
//                         <button type="button" id="js-btn-deleteTask" data-id="${task.id}" data-dismiss="modal" class="btn btn-danger">Delete task</button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
