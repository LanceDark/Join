const STORAGE_TOKEN = "3KR8NDCYECJ9GOUZ12UQQHMLLAMIYOTERR7HKYU8";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}

async function clearUsers() {
  const key = "contacts";
  await deleteItem(key);
  console.log(`Key '${key}' wurde gelöscht.`);
}

async function deleteItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url, { method: "DELETE" }).then((res) => res.json());
}

let contactsData = [
  {
    name: "Dominik Mäder",
    email: "dominik@web.de",
    phone: "01525252525",
    color: "#1FD7C1",
    id: 1702911741205,
  },
  {
    name: "Max Mustermann",
    email: "max.mustermann@example.com",
    phone: "01234567890",
    color: "#FF5733",
    id: 1701234567890,
  },
  {
    name: "Anna Schmidt",
    email: "anna.schmidt@example.com",
    phone: "09876543210",
    color: "#A2FF5E",
    id: 1709876543210,
  },
  {
    name: "Laura Müller",
    email: "laura.mueller@example.com",
    phone: "07654321098",
    color: "#FFB633",
    id: 1707654321098,
  },
  {
    name: "Michael Bauer",
    email: "michael.bauer@example.com",
    phone: "01234567891",
    color: "#33FFC3",
    id: 1701234567891,
  },
  {
    name: "Sophie Fischer",
    email: "sophie.fischer@example.com",
    phone: "01987654321",
    color: "#FF3357",
    id: 1701987654321,
  },
  {
    name: "David Schuster",
    email: "david.schuster@example.com",
    phone: "03456789012",
    color: "#8C33FF",
    id: 1703456789012,
  },
  {
    name: "Julia Richter",
    email: "julia.richter@example.com",
    phone: "04567890123",
    color: "#FF33A2",
    id: 1704567890123,
  },
];

const contactsJson = JSON.stringify(contactsData);

let tasksupload = [
  {
    title: "Finish Portfolio",
    description: "Finish stylings",
    dueDate: "2024-01-07",
    label: "Technical Task",
    priority: "Urgent",
    subtasks: [
      { text: "Finish simpleCRM", status: "done" },
      { text: "Edit stylings", status: "done" },
    ],
    assignees: [
      {
        name: "Sophie Fischer",
        email: "sophie.fischer@example.com",
        phone: "01987654321",
        color: "#FF3357",
        id: 1701987654321,
      },
      {
        name: "David Schuster",
        email: "david.schuster@example.com",
        phone: "03456789012",
        color: "#8C33FF",
        id: 1703456789012,
      },
      {
        name: "Julia Richter",
        email: "julia.richter@example.com",
        phone: "04567890123",
        color: "#FF33A2",
        id: 1704567890123,
      },
    ],
    id: 1,
    category: "to-do",
  },
  {
    title: "Ask for feedback",
    description: "Ask for feedback.",
    dueDate: "2023-12-25",
    label: "Technical Task",
    priority: "Urgent",
    subtasks: [],
    assignees: [
      {
        name: "Anna Schmidt",
        email: "anna.schmidt@example.com",
        phone: "09876543210",
        color: "#A2FF5E",
        id: 1709876543210,
      },
      {
        name: "Laura Müller",
        email: "laura.mueller@example.com",
        phone: "07654321098",
        color: "#FFB633",
        id: 1707654321098,
      },
      {
        name: "Michael Bauer",
        email: "michael.bauer@example.com",
        phone: "01234567891",
        color: "#33FFC3",
        id: 1701234567891,
      },
    ],
    id: 2,
    category: "await-feedback",
  },
  {
    title: "HTML Base Template",
    description: "HTML Base Template Creation",
    dueDate: "2023-12-31",
    label: "User Story",
    priority: "Low",
    subtasks: [
      { text: "Summary page", status: "done" },
      { text: "Add Task page", status: "done" },
      { text: "Board page", status: "todo" },
      { text: "Contacts page", status: "todo" },
    ],
    assignees: [
      {
        name: "Sophie Fischer",
        email: "sophie.fischer@example.com",
        phone: "01987654321",
        color: "#FF3357",
        id: 1701987654321,
      },
      {
        name: "David Schuster",
        email: "david.schuster@example.com",
        phone: "03456789012",
        color: "#8C33FF",
        id: 1703456789012,
      },
      {
        name: "Julia Richter",
        email: "julia.richter@example.com",
        phone: "04567890123",
        color: "#FF33A2",
        id: 1704567890123,
      },
    ],
    id: 3,
    category: "await-feedback",
  },
  {
    title: "CSS Architecture Planning",
    description: "CSS Architecture Planning",
    dueDate: "2024-01-04",
    label: "User Story",
    priority: "Low",
    subtasks: [
      { text: "Summary page", status: "done" },
      { text: "Add Task page", status: "done" },
      { text: "Contacts page", status: "todo" },
    ],
    assignees: [
      {
        name: "Dominik Mäder",
        email: "dominik@web.de",
        phone: "01525252525",
        color: "#1FD7C1",
        id: 1702911741205,
      },
      {
        name: "Max Mustermann",
        email: "max.mustermann@example.com",
        phone: "01234567890",
        color: "#FF5733",
        id: 1701234567890,
      },
      {
        name: "Anna Schmidt",
        email: "anna.schmidt@example.com",
        phone: "09876543210",
        color: "#A2FF5E",
        id: 1709876543210,
      },
    ],
    id: 4,
    category: "in-progress",
  },
];
const taskJSON = JSON.stringify(tasksupload);
