/**
 * Creates and displays a popup message.
 * @description This function creates a popup element with the given message,
 * appends it to the document body, and removes it after a delay of 1500 milliseconds.
 * @param {string} message - The message to be displayed in the popup.
 */
function createPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = message;
    document.body.appendChild(popup);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 1500); 
}

/**
 * Changes the password for a user.
 * @description This function retrieves the email and password from input fields,
 * stores the information in local storage for password reset, displays a success popup,
 * and redirects to the login page after a delay of 1000 milliseconds.
 */
function changePassword() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let userData = {
        email: email,
        password: password
    };
    localStorage.setItem("resetpassword", JSON.stringify(userData));
    createPopup("Ihr Passwort wurde erfolgreich zurückgesetzt");
    setTimeout(() => {
        window.location.href = './login.html';
    }, 1000);
}


/**
 * Redirects the user back to the login page.
 * @description This function displays a popup message, indicating a redirection
 * to the login page, and redirects after a delay of 1000 milliseconds.
 */
function goBackToLogin() {
    createPopup("Zurück zur Anmeldeseite");
    setTimeout(() => {
        window.location.href = './login.html';
    }, 1000); 
}

