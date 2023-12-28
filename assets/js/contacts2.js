let users;
let groupedUsers;
let chosenUser;

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
  let keyToSearch = "users";
  let updatedUsers = JSON.stringify(users);
  await setItem(keyToSearch, updatedUsers);
  let retrievedUsers = await getItem(keyToSearch);
  users = JSON.parse(retrievedUsers);
  users.sort((a, b) => a.name.localeCompare(b.name));
  groupedUsers = groupUsersByFirstLetter(users);
  displayContactList(groupedUsers);
}

/**
 * display sorted by firstLetter
 * @param {Map} groupedUsers
 */
function displayContactList(groupedUsers) {
  let list = document.getElementById("userList");

  for (let [firstLetter, usersGroup] of groupedUsers) {
    list.innerHTML += `<h2>${firstLetter}</h2>`;
    for (let i = 0; i < usersGroup.length; i++) {
      let userId = `user_${i}_${firstLetter}`;
      list.innerHTML += /*html*/ `
        <div class="wrapper-for-contacts" id="${userId}" onclick="openContactDetails(${i}, '${firstLetter}')">
          <div class="showcircle" style="background-color: ${usersGroup[i].color}">PZ</div>
          <div class="wrapper-for-name-email">
            <h1 class="contact-name">${usersGroup[i].name}</h1>
            <a class="a" href="mailto:${usersGroup[i].email}">${usersGroup[i].email}</a>
          </div>
        </div>
      `;
    }
  }
}

/**
 * Groups Contacts by first Letter
 * @param {Array} users
 * @returns Map
 */
function groupUsersByFirstLetter(users) {
  let groupedContacts = new Map();

  for (let i = 0; i < users.length; i++) {
    let firstLetter = users[i].name.charAt(0).toUpperCase();
    if (!groupedContacts.has(firstLetter)) {
      groupedContacts.set(firstLetter, []);
    }
    groupedContacts.get(firstLetter).push(users[i]);
  }
  return groupedContacts;
}

function openContactDetails(index, firstLetter) {
  chosenUser = groupedUsers.get(firstLetter)[index];
  let infoAbout = document.getElementById("showUsers");
  clearInfoAbout(infoAbout);
  infoAbout.innerHTML += /*html*/ `
  <div class="wrapper-for-details">
    <div class="headline-contacts">
      <div>
        <div class="showcircle-detail" style="background-color: ${chosenUser.color}">PZ</div>
      </div>
      <div>
        <h2>${chosenUser.name}</h2>
        <div class="textContainer" >
                <p onclick="deleteUser()" class="deleteText"><img src="./assets/img/delete.svg">Delete </p>
                <p onclick="editUser()" class="deleteText" ><img src="./assets/img/edit.svg">Edit </p>
        </div>
      </div>
    </div>
    <div class="information-details">Contact Information</div>
    <div>
      <div>
        <p class="email-details">Email</p>
        <a href="" class="email-details-user">${chosenUser.email}</a>
      </div>
      <div>
        <p>Phone</p>
        <p>${chosenUser.phone}</p>
      </div>
    </div>
  </div>  
  `;
}

async function deleteUser() {
  let index = users.findIndex((user) => +user.id === +chosenUser.id);
  users.splice(index, 1);
  console.log(users);
  await setNewIdForContact(users);
  await initContacts();
  reloadPage();
}

async function setNewIdForContact(users) {
  users.forEach((user, index) => {
    user.id = index + 1;
  });
}

function clearInfoAbout(infoAbout) {
  infoAbout.innerHTML = "";
}

function reloadPage(){
  location.reload();
}