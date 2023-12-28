/**
 * initialContacts on load of Webpage
 */
async function initContacts() {
  includeHTML();
  await loadContactsLine();
}

/**
 * load contacts and Display them correctly on screen
 */
async function loadContactsLine() {
  const keyToSearch = "users";
  contacts = await getItem(keyToSearch);
  contacts = JSON.parse(contacts);
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  displayContactList(contacts);
}

/**
 * display sorted by firstLetter
 * @param {Array} contacts 
 */
function displayContactList(contacts) {
  let list = document.getElementById("userList");
  let groupedContacts = groupContactsByFirstLetter(contacts);

  for (let [firstLetter, contactsGroup] of groupedContacts) {
    list.innerHTML += `<h2>${firstLetter}</h2>`;
    for (let i = 0; i < contactsGroup.length; i++) {
      list.innerHTML += /*html*/ `
        <div class="wrapper-for-contacts">
          <div class="showcircle" style="background-color: ${contactsGroup[i].color}">PZ</div>
          <div class="wrapper-for-name-email">
            <h1 class="contact-name">${contactsGroup[i].name}</h1>
            <a class="a" href="mailto:${contactsGroup[i].email}">${contactsGroup[i].email}</a>
          </div>
        </div>
      `;
    }
  }
}

/**
 * Groups Contacts by first Letter
 * @param {Array} contacts 
 * @returns Map
 */
function groupContactsByFirstLetter(contacts) {
  let groupedContacts = new Map();

  for (let i = 0; i < contacts.length; i++) {
    let firstLetter = contacts[i].name.charAt(0).toUpperCase();
    if (!groupedContacts.has(firstLetter)) {
      groupedContacts.set(firstLetter, []);
    }
    groupedContacts.get(firstLetter).push(contacts[i]);
  }
  return groupedContacts;
}
