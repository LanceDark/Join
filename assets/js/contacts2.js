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
  await setItem("users", JSON.stringify(users));
  await initContacts();
  reloadPage();
}

async function setNewIdForContact(users) {
  users.forEach((user, index) => {
    user.id = index + 1;
  });
}

function clearInfoAbout() {
  let infoAbout = document.getElementById("showUsers");
  infoAbout.innerHTML = "";
}

function reloadPage() {
  location.reload();
}

function editUser() {
  console.log(chosenUser);
  let infoAbout = document.getElementById("showUsers");
  clearInfoAbout(infoAbout);
  infoAbout.innerHTML += /*html*/ `
  <div class="headerFromAddContact">
  <b onclick="clearInfoAbout()" id="xButton">X</b>
      <img class="joinImg" src="./assets/img/capWhite.png" alt="Join Logo">
      <h3>Edit Contact</h3>
      <p>Edit the contact details below:</p>
  </div>
  <label class="formInput">
      <label for="editName"></label>
      <input type="text" id="editName" name="name" placeholder="Name" required value="${chosenUser.name}"><br><br>
      
      <label for="editEmail"></label>
      <input type="email" id="editEmail" name="email" placeholder="Email" required value="${chosenUser.email}"><br><br>
      
      <label for="editPhone"></label>
      <input type="tel" id="editPhone" name="phone" placeholder="+49" title="tel" required value="${chosenUser.phone ? chosenUser.phone : ''}"><br><br>
      
      <div class="bContainer">
          <button class="contactbuttonsone" onclick="clearInfoAbout()">Cancel</button>
          <button class="contactbuttonsonetwo" onclick="updateContact()">Update contact</button>
      </div>
</label>
  `;
}

async function updateContact(){
  let newName = document.getElementById("editName").value;
  let newMail = document.getElementById("editEmail").value;
  let newPhone = document.getElementById("editPhone").value;
  chosenUser.email = newMail;
  chosenUser.name = newName;
  chosenUser.phone = newPhone;
  await setNewIdForContact(users);
  await setItem("users", JSON.stringify(users));
  await initContacts();
  reloadPage();
}
