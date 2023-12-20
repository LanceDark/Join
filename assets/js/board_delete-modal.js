// const deleteModal = document.querySelector('.delete-modal');
// const deleteTaskBtn = document.querySelector('.delete-modal-delete-btn');
// const cancelDeleteBtn = document.querySelector('.delete-modal-cancel-btn');

// /**
//  * Adds an event listener to the given element.
//  * @param {HTMLElement} element - The HTML element to attach the event listener to.
//  * @param {string} eventType - The type of event to listen for (e.g., 'click').
//  * @param {function} eventHandler - The function to execute when the event occurs.
//  */
// function addClickListener(element, eventType, eventHandler) {
//     element.addEventListener(eventType, eventHandler);
// }

// /**
//  * Removes an event listener from the given element.
//  * @param {HTMLElement} element - The HTML element to remove the event listener from.
//  * @param {string} eventType - The type of event for which the listener was added.
//  * @param {function} eventHandler - The function to remove as an event handler.
//  */
// function removeClickListener(element, eventType, eventHandler) {
//     element.removeEventListener(eventType, eventHandler);
// }

// /**
//  * Initiates the process of deleting a task by displaying the delete confirmation modal.
//  * @param {number} taskId - The ID of the task to be deleted.
//  */
// function deleteTask(taskId) {
//     const modal = document.querySelector('.modal');
//     modal.classList.toggle('hidden');
//     toggleDeleteModal();
//     removeClickListener(deleteTaskBtn, 'click', deleteTaskFunction);
//     removeClickListener(cancelDeleteBtn, 'click', cancelDeleteFunction);
//     addClickListener(deleteTaskBtn, 'click', () => deleteTaskFunction(taskId));
//     addClickListener(cancelDeleteBtn, 'click', cancelDeleteFunction);

// }

// /**
//  * Deletes a task with the specified ID from the local tasks array.
//  * @param {number} taskId - The ID of the task to be deleted.
//  */
// function deleteTaskFunction(taskId) {
//     console.log(localTasks);
//     const task = localTasks.find(task => +task.id === +taskId);
//     const index = localTasks.indexOf(task);
//     localTasks.splice(index, 1);
//     console.log(localTasks);
//     toggleDeleteModal();
//     closeModal();
//     removeClickListener(deleteTaskBtn, 'click', deleteTaskFunction);
//     removeClickListener(cancelDeleteBtn, 'click', cancelDeleteFunction);
// }

// /**
//  * Cancels the task deletion process by closing the delete confirmation modal.
//  */
// function cancelDeleteFunction() {
//     const modal = document.querySelector('.modal');
//     modal.classList.toggle('hidden');
//     toggleDeleteModal();
//     removeClickListener(deleteTaskBtn, 'click', deleteTaskFunction);
//     removeClickListener(cancelDeleteBtn, 'click', cancelDeleteFunction);
// }

// /**
//  * Toggles the visibility of the delete confirmation modal.
//  */
// function toggleDeleteModal() {
//     const deleteModal = document.querySelector('.delete-modal');
//     deleteModal.classList.toggle('d-none');
// }

const deleteModal = document.querySelector(".delete-modal");
const deleteTaskBtn = document.querySelector(".delete-modal-delete-btn");
const cancelDeleteBtn = document.querySelector(".delete-modal-cancel-btn");
let currentTaskId; // Variable, um die aktuelle Task-ID zu speichern

function addClickListener(element, eventType, eventHandler) {
  element.addEventListener(eventType, eventHandler);
}

function removeClickListener(element, eventType, eventHandler) {
  element.removeEventListener(eventType, eventHandler);
}

function deleteTask(taskId) {
  const modal = document.querySelector(".modal");
  modal.classList.toggle("hidden");
  toggleDeleteModal();
  currentTaskId = taskId; // Speichern der aktuellen Task-ID
  addClickListener(deleteTaskBtn, "click", deleteTaskFunction);
  addClickListener(cancelDeleteBtn, "click", cancelDeleteFunction);
}

function deleteTaskFunction() {
  const task = localTasks.find((task) => +task.id === +currentTaskId);
  const index = localTasks.indexOf(task);
  localTasks.splice(index, 1);
  toggleDeleteModal();
  setNewIdsForTasks(localTasks);
  closeModal();
  removeListeners();
}

function cancelDeleteFunction() {
  const modal = document.querySelector(".modal");
  modal.classList.toggle("hidden");
  toggleDeleteModal();
  removeListeners();
}

function removeListeners() {
  removeClickListener(deleteTaskBtn, "click", deleteTaskFunction);
  removeClickListener(cancelDeleteBtn, "click", cancelDeleteFunction);
}

function toggleDeleteModal() {
  deleteModal.classList.toggle("d-none");
}
