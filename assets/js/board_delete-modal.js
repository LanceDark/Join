const deleteModal = document.querySelector(".delete-modal");
const deleteTaskBtn = document.querySelector(".delete-modal-delete-btn");
const cancelDeleteBtn = document.querySelector(".delete-modal-cancel-btn");
let currentTaskId; 

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
  currentTaskId = taskId;
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
  showToast("✅ Task deleted");
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
