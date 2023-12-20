let currentUser = localStorage.getItem("currentUser");
let summaryLocalTasks;
let urgentCount;
let toDoCount;
let inBoardCount;
let inProgressCount;
let awaitingFeedbackCount;
let doneCount;
const urgencyDeadline = document.getElementById("urgency-deadline");
const urgentCounter = document.getElementById("urgent-counter");
const toDoCounter = document.getElementById("todo-counter");
const inBoardCounter = document.getElementById("in-board-counter");
const inProgressCounter = document.getElementById("in-progress-counter");
const awaitingFeedbackCounter = document.getElementById(
  "awaiting-feedback-counter"
);
const doneCounter = document.getElementById("done-counter");
const currentDate = new Date();
let urgencyDeadlineTask = null;
let closestDeadline = Infinity;

/**
 * Include Header/Nav-Bar on html page
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    const file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * get tasks from db
 */
async function loadTasks() {
  let tasks = JSON.parse(await getItem("tasks"));
  summaryLocalTasks = tasks;
}

/**
 * counts data in db to display what is inside
 */
async function initializeCounter() {
  urgentCount = 0;
  toDoCount = 0;
  inBoardCount = summaryLocalTasks.length;
  inProgressCount = 0;
  awaitingFeedbackCount = 0;
  doneCount = 0;
}

/**
 * init starts all needed functions
 */
async function initSummary() {
  await includeHTML();
  await loadTasks();
  await initializeCounter();
  await setHeaderInitials();
  await setProfileBadgeEventListener();
  await setActiveNavLink();
  updateCounter();
  updateNumbers();
  renderMostUrgentDate();
  renderGreetingName();
  getTime();
}

/**
 * update with db data to show right numbers of Task
 */
function updateCounter() {
  summaryLocalTasks.forEach((task) => {
    if (task.priority === "Urgent") {
      urgentCount++;
    }
    if (task.category === "to-do") {
      toDoCount++;
    }
    if (task.category === "in-board") {
      inBoardCount++;
    }
    if (task.category === "in-progress") {
      inProgressCount++;
    }
    if (task.category === "await-feedback") {
      awaitingFeedbackCount++;
    }
    if (task.category === "done") {
      doneCount++;
    }
    getMostUrgentTask(task);
  });
}

/**
 * renders the data into HTML
 */
function updateNumbers() {
  urgentCounter.textContent = urgentCount;
  toDoCounter.textContent = toDoCount;
  inBoardCounter.textContent = inBoardCount;
  inProgressCounter.textContent = inProgressCount;
  awaitingFeedbackCounter.textContent = awaitingFeedbackCount;
  doneCounter.textContent = doneCount;
}

/**
 * Split the dueDate into parts using the '-' delimiter
 * Convert the parts to integers
 * Creates the Date object with the split values
 * Checks if the deadline is closer to the current date
 * @param {*} task
 */
function getMostUrgentTask(task) {
  const dueDateParts = task.dueDate.split("-");
  const year = parseInt(dueDateParts[0]);
  const month = parseInt(dueDateParts[1]) - 1;
  const day = parseInt(dueDateParts[2]);
  const dueDate = new Date(year, month, day);
  const timeDifference = dueDate - currentDate;
  if (timeDifference >= 0 && timeDifference < closestDeadline) {
    closestDeadline = timeDifference;
    urgencyDeadlineTask = task;
  }
}

/**
 * Creates the Date object with the split values
 * Date in the desired format
 * @param {*} inputDate
 * @returns
 */
function formatDate(inputDate) {
  const parts = inputDate.split("-");
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1; // Months in JavaScript are 0-based
  const day = parseInt(parts[2]);
  const formattedDate = new Date(year, month, day);
  const options = { year: "numeric", month: "long", day: "2-digit" };
  return formattedDate.toLocaleDateString("en-US", options);
}

/**
 * Render the task with the most urgent deadline in urgencyDeadline
 */
function renderMostUrgentDate() {
  if (urgencyDeadlineTask) {
    const formattedDueDate = formatDate(urgencyDeadlineTask.dueDate);
    urgencyDeadline.textContent = `${formattedDueDate}`;
  } else {
    urgencyDeadline.textContent = "No urgent tasks.";
  }
}

/**
 * These functions enable the greeting, depending on the time of day
 */
const getTime = function () {
  const date = new Date();
  const hours = date.getHours();
  getDaytime(hours);
  renderGreetingName();
};

/**
 * get time and check which variable it should be 
 * @param {*} hours 
 */
const getDaytime = function (hours) {
  let daytime;
  if (hours < 12) {
    daytime = "morning";
  } else if (hours >= 12 && hours <= 18) {
    daytime = "afternoon";
  } else if (hours >= 18 && hours <= 24) {
    daytime = "evening";
  }
  renderTime(daytime);
};

/**
 * render the variable which was selected in function before
 * @param {*} daytime 
 */
const renderTime = function (daytime) {
  let greetingWrapper = document.getElementById("greeting");
  if (currentUser === "Guest") {
    greetingWrapper.innerHTML = `Good ${daytime}`;
  } else greetingWrapper.innerHTML = `Good ${daytime},`;
};

/**
 * display greeting of user or guest
 */
function renderGreetingName() {
  let currentUser = localStorage.getItem("Usercurrent");
  const greetingNameContainer = document.getElementById("greeting-name");
  if (currentUser !== "Guest") {
    greetingNameContainer.innerHTML = /*html*/ `${currentUser}`;
  } else {
    greetingNameContainer.innerHTML = "Guest";
  }
}
