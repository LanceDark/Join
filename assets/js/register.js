let users = [];

/**
 * Initializes the application.
 * @description This function initializes the application by loading user data.
 */
async function init() {
    loadUsers();
}

/**
 * Loads user data.
 * @description This function attempts to load user data from storage and assigns it to the 'users' variable.
 * If an error occurs, it is logged to the console.
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Creates a popup message.
 * @description This function creates a popup element with the specified message, appends it to the document body,
 * and removes it after a delay of 1000 milliseconds (1 second).
 * @param {string} message - The message to be displayed in the popup.
 */
function createPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 1000);
}

/**
 * Registers a new user.
 * @description This function disables the registration button, collects user input for email, password, and name,
 * adds the new user to the 'users' array, stores the updated array in local storage, resets the form, displays a popup,
 * and redirects to the login page after a delay of 100 milliseconds.
 */
async function register() {
    registerBtn.disabled = true;
    const name = document.getElementById('nem').value;
    users.push({
        email: email.value,
        password: password.value,
        name: name,
        id: (users.length + 1)
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
    createPopup('');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 100);
}

/**
 * Resets the registration form.
 * @description This function clears the values of the email and password input fields, and enables the registration button.
 */
function resetForm() {
    email.value = '';
    password.value = '';
    registerBtn.disabled = false;
};

