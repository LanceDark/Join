let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let selectedUserIndex;


/**
 * Initializes the application asynchronously.
 * @function init
 * @returns {void}
 */
async function init() {
    await includeHTML();
    loadAndDisplayUsers();
    await setHeaderInitials();
    await setProfileBadgeEventListener();
    await setActiveNavLink();

}
/**
 * Logs out the user by removing the user token from sessionStorage, redirecting to the login page,
 * and sending a logout request to a specified URL.
 * 
 * @function logoutUser
 * @throws {Error} Throws an error if any step of the logout process fails.
 * @returns {void}
 */
async function logoutUser() {
    try {
        sessionStorage.removeItem('userToken');
        window.location.href = "login.html";

        const logoutResponse = await fetch("https://deine-logout-url.com/logout", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });

        if (logoutResponse.ok) {
            console.log("Erfolgreich ausgeloggt!");
            alert("Sie wurden erfolgreich ausgeloggt!");
        } else {
            console.error(`Fehler beim Ausloggen. Statuscode: ${logoutResponse.status}`);
            alert("Fehler beim Ausloggen. Bitte versuchen Sie es erneut.");
        }
    } catch (error) {
        console.error("Fehler beim Ausloggen:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.");
    }
}
/**
 * Retrieves an item from a remote storage by sending a GET request to a specified URL.
 * 
 * @function getItem
 * @param {string} key - The key of the item to retrieve.
 * @throws {Error} Throws an error if the retrieval process fails or if the data for the specified key is not found.
 * @returns {Promise<any>} A promise that resolves to the retrieved item.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const responseData = await response.json();
            if (responseData.data) {
                return JSON.parse(responseData.data.value);
            } else { throw new Error(`Konnte Daten mit dem Schlüssel "${key}" nicht finden.`); }
        } else {
            console.error('Fehler beim Abrufen des Elements. Statuscode:', response.status);
            throw Error('Fehler beim Abrufen des Elements.');
        }
    } catch (error) {
        console.error('Fehler beim Abrufen des Elements:', error);
        throw error;
    }
}


/**
 * Loads contacts from local storage, sorts them by name, generates HTML for the user list,
 * and displays the sorted user list on the page.
 * 
 * @function loadAndDisplayUsers
 * @throws {Error} Throws an error if any step of the process fails.
 * @returns {void}
 */
async function loadAndDisplayUsers() {
    try {
        const contacts = await getContactsFromLocalStorage();
        const sortedContacts = sortContactsByName(contacts);
        const userListHTML = generateUserListHTML(sortedContacts);
        displayUserList(userListHTML, sortedContacts);
    } catch (error) {
        handleLoadAndDisplayUsersError(error);
    }
}

/**
 * Retrieves contacts from local storage.
 * 
 * @function getContactsFromLocalStorage
 * @returns {Array} An array of contacts retrieved from local storage.
 */
async function getContactsFromLocalStorage() {
    const contactsJSON = localStorage.getItem('contacts') || '[]';
    return JSON.parse(contactsJSON);
}


/**
 * Generates HTML for displaying a sorted user list.
 * 
 * @function generateUserListHTML
 * @param {Array} contacts - The array of contacts to be displayed.
 * @returns {string} HTML string for the sorted user list.
 */
function generateUserListHTML(contacts) {
    if (contacts.length === 0) {
        return '';
    }
    const sortedContacts = sortContactsByName(contacts);
    const userListSections = generateUserListSections(sortedContacts);
    return userListSections.join('');
}

/**
 * Generates HTML sections for displaying a sorted user list with headers for each alphabetical group.
 * 
 * @function generateUserListSections
 * @param {Array} sortedContacts - The array of contacts sorted by name.
 * @returns {Array} An array of HTML sections for the sorted user list.
 */
function generateUserListSections(sortedContacts) {
    const userListSections = [];
    let currentLetter = '';

    sortedContacts.forEach((userData, index) => {
        const nameInitials = getInitials(userData.name);
        const firstLetter = nameInitials.charAt(0).toUpperCase();
        const randomColor = getRandomColor();

        if (firstLetter !== currentLetter) {
            userListSections.push(generateHeaderHTML(firstLetter));
            currentLetter = firstLetter;
        }

        userListSections.push(generateUserEntryHTML(index, userData, nameInitials, randomColor));
    });

    return userListSections;
}


/**
 * Sorts an array of contacts by name.
 * 
 * @function sortContactsByName
 * @param {Array} contacts - The array of contacts to be sorted.
 * @returns {Array} The sorted array of contacts.
 */
function sortContactsByName(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Generates initials from a given name.
 * 
 * @function getInitials
 * @param {string} name - The name from which initials are generated.
 * @returns {string} Initials generated from the name.
 */
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('');
}


/**
 * Generates HTML for a header with a specified letter.
 * 
 * @function generateHeaderHTML
 * @param {string} letter - The letter for the header.
 * @returns {string} HTML string for the header with the specified letter.
 */
function generateHeaderHTML(letter) {
    return `
                <div class="divh2">
                    <h2>${letter}</h2>
                </div>`;
}

/**
 * Generates HTML for a user entry with specified data.
 * 
 * @function generateUserEntryHTML
 * @param {number} index - The index of the user entry.
 * @param {Object} userData - The data for the user.
 * @param {string} nameInitials - The initials for the user.
 * @param {string} randomColor - The random color for the user circle.
 * @returns {string} HTML string for the user entry with specified data.
 */
function generateUserEntryHTML(index, userData, nameInitials, randomColor) {
    return `
        <div onclick="showUser(${index})" class="textContent">
            <div class="circle" style="background-color: ${randomColor};">${nameInitials}</div>
            <div class="nameandemail">
                <p class="name">${userData.name}</p>
                <a href="mailto:${userData.email}">${userData.email}</a>
            </div>
        </div>
    `;
}

/**
 * Displays a user list on the page.
 * 
 * @function displayUserList
 * @param {string} userListHTML - The HTML string for the user list.
 * @param {Array} sortedContacts - The array of contacts sorted by name.
 * @returns {void}
 */
function displayUserList(userListHTML, sortedContacts) {
    const userList = document.getElementById('userList');
    userList.innerHTML = userListHTML + `
    `;

    userList.sortedContacts = sortedContacts;
}


/**
 * Toggles the visibility of the contactsContainer and showUsers elements.
 * 
 * @function goToPersonContacts
 * @returns {void}
 */
function goToPersonContacts() {
    var contactsContainer = document.getElementById("contactsContainer");
    var showUsers = document.getElementById("showUsers");

    if (contactsContainer.style.display === "none") {
        showUsers.style.display = "unset";
    } else {
        contactsContainer.style.display = "none";
        showUsers.style.display = "unset";
    }
}


/**
 * Handles errors that occur during the loading and displaying of users.
 * 
 * @function handleLoadAndDisplayUsersError
 * @param {Error} error - The error that occurred.
 * @returns {void}
 */
function handleLoadAndDisplayUsersError(error) {
    console.error('Fehler beim Laden und Anzeigen der Benutzer:', error);
}


/**
 * Generates a random hexadecimal color code.
 * 
 * @function getRandomColor
 * @returns {string} A randomly generated color code.
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Displays details for a selected user.
 * 
 * @function showUser
 * @param {number} sortedIndex - The index of the selected user in the sorted contacts list.
 * @returns {void}
 */
async function showUser(sortedIndex) {
    const clearcontactsContainer = document.getElementById('contactsContainer');
    clearcontactsContainer.innerHTML = '';
    const addContactsDiv = document.getElementById('addContacts');
    addContactsDiv.innerHTML = '';
    const userDetailsContainer = document.getElementById('showUsers');
    userDetailsContainer.innerHTML = '';

    try {
        const contacts = await getContactsFromLocalStorage();
        if (sortedIndex < 0 || sortedIndex >= contacts.length) {
            userDetailsContainer.innerHTML = 'Benutzer nicht gefunden';
            return;
        }

        const sortedContacts = sortContactsByName(contacts);
        selectedUserIndex = sortedIndex;
        const user = sortedContacts[selectedUserIndex];
        const userDetailsHTML = generateUserDetailsHTML(user, selectedUserIndex);
        userDetailsContainer.innerHTML = userDetailsHTML;
    } catch (error) {
        console.error('Fehler beim Abrufen von Kontakten:', error);
        userDetailsContainer.innerHTML = 'Fehler beim Laden des Benutzers';
    }
}

/**
 * Generates HTML for displaying details of a user.
 * 
 * @function generateUserDetailsHTML
 * @param {Object} user - The user object containing details.
 * @param {number} userId - The ID of the user.
 * @returns {string} HTML string for displaying user details.
 */
function generateUserDetailsHTML(user, userId) {
    const { name, email, phone, color } = user;
    const nameInitials = name
        .split(' ')
        .map(word => word[0])
        .join('');
    return /*html*/`
        <div class="textandcolor">
        <img class="arrowleftimg" onclick="goBackToContacts()" src="./assets/img/arrowLeft.png" alt="" srcset="">
            <div class="showcircle" style="background-color: ${color}; ">${nameInitials}</div>
            <div class="h1andtext">
                <h1>${name}</h1>
                <div class="textContainer" >
                <p onclick="deleteUser(${userId})" class="deleteText"><img src="./assets/img/delete.svg">Delete </p>
                    <p onclick="editUser()" class="deleteText" ><img src="./assets/img/edit.svg">Edit </p>
                </div>
            </div> 
        </div>
        <h2>Kontaktinformationen</h2>
        <h3>Email</h3>
        <a class="a" href="mailto:${email}">${email}</a>
        <h3>Telefon</h3>
        <b>+49${phone}</b>
        <div class="moreVertContainer" >
            <img  onclick="goToMobileContacts()" class="moreVert" src="./assets/img/more_vert.png">
        </div>`;
}


/**
 * Navigates to the mobile contacts page.
 * @function goToMobileContacts
 * @returns {void}
 */
function goToMobileContacts() {
    showUsers.innerHTML = '';
    window.location.href = "contacts.html";
}

/**
 * Asynchronously includes HTML content from external files into elements with the "w3-include-html" attribute.
 * 
 * @function includeHTML
 * @returns {void}
 */
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

/**
 * Clears existing containers, creates a new contact form, and adds it to the page.
 * 
 * @function addNewContact
 * @returns {void}
 */
function addNewContact() {
    const clearcontactsContainer = document.getElementById('contactsContainer');
    clearcontactsContainer.innerHTML = '';
    const userDetailsContainer = document.getElementById('showUsers');
    userDetailsContainer.innerHTML = '';

    const newContactDiv = createNewContactDiv();
    const addContactsDiv = document.getElementById('addContacts');
    addContactsDiv.appendChild(newContactDiv);
}

/**
 * Creates a new contact form container with input fields and buttons.
 * 
 * @function createNewContactDiv
 * @returns {HTMLDivElement} The created contact form container.
 */
function createNewContactDiv() {
    const newContactDiv = document.createElement('div');
    newContactDiv.classList.add('openContainer');
    newContactDiv.innerHTML = /*html*/`
        <div>
            <div class="headerFromAddContact">
            <b onclick="goBackToContacts()" id="xButton">X</b>
                <img class="joinImg" src="./assets/img/capWhite.png" alt="Join Logo">
                <h3>Add Contact</h3>
                <p>Tasks are better with a team!</p>
            </div>
            <div class="imgContainer" >
                <img class="addLogo deaktiviert-hover " src="./assets/img/person_add.svg" alt="logoContact">
            </div>
            <form class="formInput" >
                <label for="name"></label>
                <input type="text" id="name" name="name" placeholder="Name" required><br><br> 
                <label for="email"></label>
                <input type="email" id="email" name="email" placeholder="Email" required><br><br>
                
                <label for="phone"></label>
                <input type="tel" id="phone" name="phone" placeholder="+49" required><br><br>
                <div class="bContainer">
                <button class="contactbuttonsone" onclick="goBackToInitialState()">Cancel &#10006;</button>
                    <button class="contactbuttonsonetwo" onclick="createContact()">Create contact &#10003;</button>
                </div>
            </form>
        </div>
    `;

    return newContactDiv;
}

/**
 * Creates a new contact from input values, adds it to the contacts list, and displays all contacts.
 * 
 * @function createContact
 * @returns {void}
 */
function createContact() {
    let addname = document.getElementById("name").value;
    let addemail = document.getElementById("email").value;
    let addphone = document.getElementById("phone").value;


    if (!isValidName(addname) || !isValidEmail(addemail) || !isValidPhoneNumber(addphone)) {
       
        displayValidationMessage("Bitte überprüfen Sie Ihre Eingaben. Stellen Sie sicher, dass der Name nicht leer ist, die E-Mail-Adresse korrekt ist und die Telefonnummer gültig ist.");
        return false; 
    }

    let contact = {
        name: addname,
        email: addemail,
        phone: addphone,
    };

    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    contacts.push(contact);
    contacts = sortContactsByName(contacts);
    localStorage.setItem("contacts", JSON.stringify(contacts));
    showAllContacts();
}

/**
 * checks whether an @ character is present
 * @param {*} email 
 * @returns 
 */
function isValidEmail(email) {
    return email.includes("@");
}

/**
 * 
This function checks whether the value of name is not empty after removing spaces at the beginning and end. If the value is not empty, true is returned; otherwise false is returned.
 * @param {*} name 
 * @returns 
 */
function isValidName(name) {
    return name.trim() !== "";
}


function isValidPhoneNumber(phone) {
    return phone.trim() !== "";
}

/**
 * Displays all contacts or a message if no contacts are found.
 * 
 * @function showAllContacts
 * @returns {void}
 */
function showAllContacts() {
    const userDetailsContainer = document.getElementById('showUsers');
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    if (contacts.length > 0) {
        const userDetailsHTML = generateContactsHTML(contacts);
        userDetailsContainer.innerHTML = userDetailsHTML;
    } else {
        userDetailsContainer.innerHTML = 'Keine Kontakte gefunden';
    }
}

/**
 * Checks whether the phone number is not empty, returns the value true
 * @param {*} contacts 
 * @returns 
 */
function generateContactsHTML(contacts) {
    let userDetailsHTML = '';
    for (const contact of contacts) {
        const { name, email, phone } = contact;
        const nameInitials = name
            .split(' ')
            .map(word => word[0])
            .join('');
        userDetailsHTML += generateContactHTML(contact.color, nameInitials, name, email, phone);
    }
    return userDetailsHTML;
}


/**
 * Generates HTML for displaying a list of contacts.
 * 
 * @function generateContactsHTML
 * @param {Array} contacts - The array of contact objects.
 * @returns {string} HTML string for displaying contacts.
 */
function generateContactHTML(color, initials, name, email, phone) {
    return /*html*/`
        <div class="textandcolor">
            <div class="showcircle" style="background-color: ${color}; font-size: 60px; padding: 20px 45px;">${initials}</div>
            <h1>${name}</h1>
        </div>
        <h2>Contact Information</h2>
        <h3>Email</h3>
        <a class="a" href="mailto:${email}">${email}</a>
        <h3>Phone</h3>
        <b>+49${phone}</b>
        <hr>
        
       `;
}

/**
 * Toggles the visibility of the main container and the add contact header.
 * 
 * @function closeWindow
 * @returns {void}
 */
function closeWindow() {
    let displayNoneContainer = document.getElementById('container');
    let headerFromAddContact = document.querySelector('.openContainer');
    let isContainerHidden = displayNoneContainer.style.display === '' || displayNoneContainer.style.display === 'none';
    if (isContainerHidden) {
        displayNoneContainer.style.display = ' ';
        headerFromAddContact.style.display = 'none';
    } else {
        displayNoneContainer.style.display = 'none';
        headerFromAddContact.style.display = '';
    }
}


/** 
 * got to legal_notice.html
 * */
function redirectToLegalNotice() {
    window.location.href = "legal_notice.html";
}
/** 
 * got to redirectToPrivacyPolicy.html
 * */
function redirectToPrivacyPolicy() {
    window.location.href = "privacy_policy.html";
}

/**
 * Deletes a user based on the provided user ID, shows a confirmation popup, and updates the user list.
 * 
 * @function deleteUser
 * @param {number} userId - The ID of the user to be deleted.
 * @returns {void}
 */
function deleteUser(userId) {
    if (selectedUserIndex === undefined || selectedUserIndex < 0) {
        console.error('Benutzer nicht gefunden');
        return;
    }
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    const selectedUserEmail = sortContactsByName(contacts)[selectedUserIndex].email;
    const sortedContacts = contacts.slice().sort((a, b) => a.name.localeCompare(b.name));
    const sortedIndex = sortedContacts.findIndex(contact => contact.email === selectedUserEmail);

    if (sortedIndex === -1) {
        console.error('Benutzer nicht gefunden');
        return;
    }

    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
    const confirmationMessage = `Möchten Sie den Benutzer "${sortedContacts[sortedIndex].name}" wirklich löschen?`;
    const messageElement = document.createElement('p');
    messageElement.textContent = confirmationMessage;
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.id = 'ok-Clear-Button';
    okButton.setAttribute('onclick', 'okClearButtonClick()');
    okButton.addEventListener('click', () => {
        const updatedContacts = contacts.filter(contact => contact.email !== selectedUserEmail);
        localStorage.setItem('contacts', JSON.stringify(updatedContacts));
        loadAndDisplayUsers();
        const userDetailsContainer = document.getElementById('showUsers');
        userDetailsContainer.innerHTML = '';
        document.body.removeChild(popupContainer);
    });
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Abbrechen';
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(popupContainer);
    });
    popupContainer.appendChild(messageElement);
    popupContainer.appendChild(okButton);
    popupContainer.appendChild(cancelButton);
    document.body.appendChild(popupContainer);
}

/**
 * go to contacts.html
 */
function okClearButtonClick() {
    window.location.href = 'contacts.html';
}


/**
 * Edits a user by displaying an edit form with the user's information.
 * 
 * @function editUser
 * @returns {void}
 */
function editUser() {
    const userDetailsContainer = document.getElementById('showUsers');
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];

    if (selectedUserIndex === undefined || selectedUserIndex < 0 || selectedUserIndex >= contacts.length) {
        userDetailsContainer.innerHTML = 'Benutzer nicht gefunden';
        return;
    }
    const selectedUserEmail = sortContactsByName(contacts)[selectedUserIndex].email;
    const sortedContacts = contacts.slice().sort((a, b) => a.name.localeCompare(b.name));
    const sortedIndex = sortedContacts.findIndex(contact => contact.email === selectedUserEmail);

    if (sortedIndex === -1) {
        userDetailsContainer.innerHTML = 'Benutzer nicht gefunden';
        return;
    }

    const user = sortedContacts[sortedIndex];
    const { name, email, phone } = user;
    const editFormHTML = generateEditFormHTML(name, email, phone);
    userDetailsContainer.innerHTML = editFormHTML;
    attachEventListeners();
}

/**
 * Generates HTML for an edit form with contact details.
 * 
 * @function generateEditFormHTML
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {string} HTML string for the edit form.
 */
function generateEditFormHTML(name, email, phone) {
    return /*html*/`
        <div class="headerFromAddContact">
        <b onclick="goBackToContacts()" id="xButton">X</b>
            <img class="joinImg" src="./assets/img/capWhite.png" alt="Join Logo">
            <h3>Edit Contact</h3>
            <p>Edit the contact details below:</p>
        </div>
        <form class="formInput">
            <label for="editName"></label>
            <input type="text" id="editName" name="name" placeholder="Name" required value="${name || ''}"><br><br>
            
            <label for="editEmail"></label>
            <input type="email" id="editEmail" name="email" placeholder="Email" required value="${email || ''}"><br><br>
            
            <label for="editPhone"></label>
            <input type="tel" id="editPhone" name="phone" placeholder="+049" title="tel" required value="${phone || ''}"><br><br>
            
            <div class="bContainer">
                <button class="contactbuttonsone" onclick="cancelEdit()">Cancel &#10006;</button>
                <button class="contactbuttonsonetwo" onclick="updateContact()">Update contact &#10003;</button>
            </div>
        </form>

        
    `;
}


/**
 * Attaches event listeners to the cancel and update buttons in the edit form.
 * 
 * @function attachEventListeners
 * @returns {void}
 */
function attachEventListeners() {
    const cancelButton = document.querySelector('.contactbuttonsone');
    const updateButton = document.querySelector('.contactbuttonsonetwo');
    cancelButton.addEventListener('click', cancelEdit);
    updateButton.addEventListener('click', updateContact);
}

/**
 * Updates the contact details based on the values entered in the edit form.
 * 
 * @function updateContact
 * @returns {void}
 */
function updateContact() {
    const editName = document.getElementById('editName').value;
    const editEmail = document.getElementById('editEmail').value;
    const editPhone = document.getElementById('editPhone').value;
    const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    if (selectedUserIndex === undefined || selectedUserIndex < 0 || selectedUserIndex >= contacts.length) {
        console.error('Benutzer nicht gefunden');
        return;
    }
    contacts[selectedUserIndex].name = editName;
    contacts[selectedUserIndex].email = editEmail;
    contacts[selectedUserIndex].phone = editPhone;
    localStorage.setItem('contacts', JSON.stringify(contacts));
    loadAndDisplayUsers();
    showUser(selectedUserIndex);
}
/**
 * go to contacts.html 
 */
function goBackToInitialState() {
    window.location.href = "contacts.html";
}

/**
 * go to contacts.html 
 */
function goBackToContacts() {
    window.location.href = "contacts.html"
}
