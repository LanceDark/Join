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
      list.innerHTML += createContactList(userId, firstLetter, usersGroup, i);
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

/**
 * open the contacts on side to work in
 * @param {string} index
 * @param {string} firstLetter
 */
function openContactDetails(index, firstLetter) {
  let infoAbout = document.getElementById("showUsers");
  infoAbout.style.display = "flex";
  //clearInfoAbout();
  chosenUser = groupedUsers.get(firstLetter)[index];
  infoAbout.innerHTML += createDetailsContact();
}

/**
 * delte the user from db
 */
async function deleteUser() {
  let index = users.findIndex((user) => +user.id === +chosenUser.id);
  users.splice(index, 1);
  await setNewIdForContact(users);
  await setItem("users", JSON.stringify(users));
  await initContacts();
  reloadPage();
}

/**
 * create a new ID for each users. to avoid mistakes
 * @param {number} users
 */
async function setNewIdForContact(users) {
  users.forEach((user, index) => {
    user.id = index + 1;
  });
}

/**
 * close the showUsers interface
 */
function clearInfoAbout() {
  let infoAbout = document.getElementById("showUsers");
  infoAbout.innerHTML = "";
  infoAbout.style.display = "none"
}

/**
 * reload page to display new contacts or current ones
 */
function reloadPage() {
  window.location.reload(true);
}

/**
 * function to edit the function
 */
function editUser() {
  let infoAbout = document.getElementById("showUsers");
  if (infoAbout.style.display = "flex") {
    infoAbout.innerHTML = createEditInterface();
  } else {
    infoAbout.style.display = "flex";
  }
  infoAbout.innerHTML = createEditInterface();
}

/**
 * update the current contact
 */
async function updateContact() {
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

/**
 * open interface to create new content
 */
function createNewContactDiv() {
  let infoAbout = document.getElementById("showUsers");
  infoAbout.style.display = "flex";
  infoAbout.innerHTML = createContactDiv();
}

/**
 * get values to save the current users
 */
async function createContactOnline() {
  let users;
  let newName = document.getElementById("name").value;
  let newMail = document.getElementById("email").value;
  let newPhone = document.getElementById("phone").value;
  let newUser = {
    name: newName,
    email: newMail,
    phone: newPhone,
  };
  let usersJSON = await getItem("users");

  if (usersJSON) {
    users = JSON.parse(usersJSON);
    if (!Array.isArray(users)) {
      users = [];
    }
    users.push(newUser);
    await setItem("users", JSON.stringify(users));
    reloadPage();
  } else {
    await setItem("users", JSON.stringify([newUser]));
    reloadPage();
  }
}

/**
 * HTML code
 */
function createContactDiv() {
  return /*html*/ ` 
        <div>
            <div class="headerFromAddContact">
            <b onclick="clearInfoAbout()" id="xButton">X</b>
                <img class="joinImg" src="./assets/img/capWhite.png" alt="Join Logo">
                <h3>Add Contact</h3>
                <p>Tasks are better with a team!</p>
            </div>
            <div class="imgContainer" >
                <img class="addLogo deaktiviert-hover " src="./assets/img/person_add.svg" alt="logoContact">
            </div>
            <label class="formInput" >
                <label for="name"></label>
                <input type="text" id="name" name="name" placeholder="Name" required><br><br> 
                <label for="email"></label>
                <input type="email" id="email" name="email" placeholder="Email" required><br><br>
                <label for="phone"></label>
                <input type="tel" id="phone" name="phone" placeholder="+49" required><br><br>
                <div class="bContainer">
                <button class="contactbuttonsone" onclick="clearInfoAbout()">Cancel</button>
                    <button class="contactbuttonsonetwo" onclick="createContactOnline()">Create contact</button>
                </div>
            </label>
        </div>
    `;
}

/**
 * HTML code
 */

function createEditInterface() {
  return /*html*/ `
  <div class="headerFromAddContact">
  <b onclick="clearInfoAbout()" id="xButton">X</b>
      <img class="joinImg" src="./assets/img/capWhite.png" alt="Join Logo">
      <h3>Edit Contact</h3>
      <p>Edit the contact details below:</p>
  </div>
  <label class="formInput">
      <label for="editName"></label>
      <input type="text" id="editName" name="name" placeholder="Name" required value="${
        chosenUser.name
      }"><br><br>
      
      <label for="editEmail"></label>
      <input type="email" id="editEmail" name="email" placeholder="Email" required value="${
        chosenUser.email
      }"><br><br>
      
      <label for="editPhone"></label>
      <input type="tel" id="editPhone" name="phone" placeholder="+49" title="tel" required value="${
        chosenUser.phone ? chosenUser.phone : ""
      }"><br><br>
      
      <div class="bContainer">
          <button class="contactbuttonsone" onclick="clearInfoAbout()">Cancel</button>
          <button class="contactbuttonsonetwo" onclick="updateContact()">Update contact</button>
      </div>
</label>
  `;
}

/**
 * HTML code
 * @returns
 */
function createDetailsContact() {
  let initials = generateInitials(chosenUser.name)
  return /*html*/ `
<div class="wrapper-for-details">
  <div class="headline-contacts">
    <div>
      <div class="showcircle-detail" style="background-color: ${chosenUser.color}">${initials}</div>
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
  <div class="gapper-between">
    <div>
      <p class="email-details">Email</p>
      <a href="" class="email-details-user">${chosenUser.email}</a>
    </div>
    <div>
      <p class="email-details">Phone</p>
      <p class="phone-details-user">${chosenUser.phone}</p>
    </div>
  </div>
</div>  
`;
}

/**
 * html code 
 * @param {number} userId 
 * @param {string} firstLetter 
 * @param {string} usersGroup 
 * @param {number} i 
 * @returns 
 */
function createContactList(userId, firstLetter, usersGroup, i) {
  let initials = generateInitials(usersGroup[i].name)
  return /*html*/ `
        <div class="wrapper-for-contacts" id="${userId}" onclick="openContactDetails(${i}, '${firstLetter}')">
          <div class="showcircle" style="background-color: ${usersGroup[i].color}">${initials}</div>
          <div class="wrapper-for-name-email">
            <h1 class="contact-name">${usersGroup[i].name}</h1>
            <a class="a" href="mailto:${usersGroup[i].email}">${usersGroup[i].email}</a>
          </div>
        </div>
      `;
}

/**
 * split initials to showcase better initials
 * @param {string} nameContact 
 * @returns 
 */
function generateInitials(nameContact) {
  const nameParts = nameContact.split(" ");
  const initials = nameParts.map((part) => part[0]).join("");
  const initialsUppercase = initials.toUpperCase();
  return initialsUppercase;
}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}
