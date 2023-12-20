const STORAGE_TOKEN = '3KR8NDCYECJ9GOUZ12UQQHMLLAMIYOTERR7HKYU8';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let Usercurrent;
        /**The getItem function constructs a URL with a key, fetches data from that URL, 
        * handles the response to retrieve data, and parses the data, returning it,
        *  allowing retrieval of data associated with the provided key from a remote storage source. */
async function getItem(key) {
    const url = buildStorageUrl(key);
    const response = await fetchItem(url);
    const responseData = await handleResponse(response);
    return parseData(responseData);
}

/**
 * Builds a storage URL for a given key using the provided token.
 * @param {string} key - The key for the storage URL.
 * @returns {string} The constructed storage URL.
 */
function buildStorageUrl(key) {
    return `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
}
 /**
 * Fetches an item from the specified URL using the fetch API.
 * @param {string} url - The URL to fetch the item from.
 * @returns {Promise<Response>} A Promise that resolves to the fetch response.
 * @throws {Error} If the fetch request is not successful.
 */
async function fetchItem(url) {
    const response = await fetch(url);
    if (!response.ok) {
        handleError(response);
    }
    return response;
}
/**
 * Handles the response from a fetch request by parsing the JSON data and returning the value.
 * @param {Response} response - The response object from the fetch request.
 * @returns {Promise<any>} A Promise that resolves to the parsed value from the response data.
 * @throws {Error} If the response data does not contain the expected "data" property.
 */
async function handleResponse(response) {
    const responseData = await response.json();
    if (!responseData.data) {
        throw new Error(`Konnte Daten nicht finden.`);
    }
    return responseData.data.value;
}
/**
 * Parses JSON data and returns the resulting JavaScript object.
 * @param {string} data - The JSON data to be parsed.
 * @returns {Object} The JavaScript object resulting from parsing the JSON data.
 * @throws {Error} If an error occurs during the JSON parsing process.
 */     
function parseData(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Fehler beim Parsen der Daten:', error);
        throw error;
    }
}

/**
 * Handles errors that occur during the retrieval of an element through an HTTP request.
 * @param {Response} response - The HTTP response object.
 * @throws {Error} Error message indicating the failure in retrieving the element.
 */
function handleError(response) {
    console.error('Fehler beim Abrufen des Elements. Statuscode:', response.status);
    throw new Error('Fehler beim Abrufen des Elements.');
}

/**
 * Checks the local storage for a stored password associated with the provided email.
 * @param {string} email - The email for which the password needs to be checked.
 * @param {string} password - The password to be checked against the stored password.
 * @returns {boolean} True if the password matches, false otherwise.
 */        
function checkLocalPassword(email, password) {
    const storedPassword = localStorage.getItem(email);
    if (storedPassword === password) {
        return true;
    }
    const resetPasswordData = JSON.parse(localStorage.getItem('resetpassword'));
    if (resetPasswordData && resetPasswordData.email === email && resetPasswordData.password === password) {
        return true;
    }
    return false;
}

/**
 * Asynchronously logs in a user based on the provided email and password.
 * @description This function retrieves user data, attempts to find a matching user, and handles the login process accordingly.
 */
async function loginUser() {
    const inputEmail = document.querySelector('.inputEmail').value;
    const inputPassword = document.querySelector('.inputPassword').value;
    try {
        const userData = await getItem('users');
        const user = findUser(userData, inputEmail, inputPassword);
        if (user) {
            handleSuccessfulLogin(user);
        } else {
            handleFailedLogin();
        }
    } catch (error) {
        handleError(error);
    }
}

/**
 * Finds a user in the provided user data based on the input email and password.
 * @param {Array} userData - An array of user data.
 * @param {string} inputEmail - The email entered by the user.
 * @param {string} inputPassword - The password entered by the user.
 * @returns {object|null} - The found user object or null if not found.
 * @description This function searches for a user with a matching email and password in the provided user data.
 */
function findUser(userData, inputEmail, inputPassword) {
    return userData.find(user => user.email === inputEmail &&
        (user.password === inputPassword || checkLocalPassword(inputEmail, inputPassword)));
        }
        
/**
 * Handles a successful user login.
 * @param {object} user - The user object representing the logged-in user.
 * @description This function sets the current user in local storage, creates a success popup, and redirects to the summary page after a delay.
 */
function handleSuccessfulLogin(user) {
    Usercurrent = user.name;
    localStorage.setItem('Usercurrent', Usercurrent);
    createPopup('Anmeldung erfolgreich!');
    setTimeout(() => {
        window.location.href = 'summary.html';
    }, 900);
}

/**
 * Handles a failed user login attempt.
 * @description This function creates a popup with a message indicating incorrect email or password.
 */
function handleFailedLogin() {
    createPopup('Falsche E-Mail oder Passwort.');
}

/**
 * Handles errors that occur during the login process.
 * @description This function logs the error to the console and creates a modal with an error message.
 * @param {Error} error - The error that occurred during login.
 */
function handleError(error) {
    console.error('Fehler bei der Anmeldung:', error);
    createModal('Bei der Anmeldung ist ein Fehler aufgetreten.');
}

/**
 * Creates a modal with a specified message.
 * @description This function creates a modal element, adds content (close button and message), and appends it to the document body.
 * @param {string} message - The message to be displayed in the modal.
 */
function createModal(message) {
    const modal = createModalElement();
    const modalContent = createModalContent();
    const closeButton = createCloseButton(modal);
    const modalMessage = createModalMessage(message);

    if (document.body) {
        appendElements(modalContent, [closeButton, modalMessage]);
        appendElements(document.body, [modal]);
        showModal(modal);
    } else {
        
    }
}

/**
 * Creates a modal element.
 * @description This function creates a modal element with the CSS class 'modal'.
 * @returns {HTMLDivElement} - The created modal element.
 */
function createModalElement() {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    return modal;
}

/**
 * Creates a modal content element.
 * @description This function creates a modal content element with the CSS class 'modal-content'.
 * @returns {HTMLDivElement} - The created modal content element.
 */
function createModalContent() {
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    return modalContent;
}
        
/**
 * Creates a close button for the modal.
 * @description This function creates a close button element with the CSS class 'close'.
 * It also adds a click event listener to remove the modal from the document body.
 * @param {HTMLElement} modal - The modal element to which the close button is associated.
 * @returns {HTMLSpanElement} - The created close button element.
 */
function createCloseButton(modal) {
    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    return closeButton;
}

/**
 * Creates a message element for the modal.
 * @description This function creates a paragraph element and sets its text content to the provided message.
 * @param {string} message - The message to be displayed in the modal.
 * @returns {HTMLParagraphElement} - The created message element.
 */
function createModalMessage(message) {
    const modalMessage = document.createElement('p');
    modalMessage.textContent = message;
    return modalMessage;
}

/**
 * Appends multiple elements to a parent element.
 * @description This function appends an array of elements to a specified parent element.
 * @param {HTMLElement} parent - The parent element to which the child elements will be appended.
 * @param {Array<HTMLElement>} elements - An array of child elements to be appended.
 */
function appendElements(parent, elements) {
    elements.forEach(element => {
        parent.appendChild(element);
    });
}

/**
 * Creates a popup message and appends it to the body.
 * @description This function creates a popup element with the provided message, appends it to the body, and removes it after a timeout.
 * @param {string} message - The message to be displayed in the popup.
 */
function createPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.textContent = message;
    console.log(document.body); 
    document.body.appendChild(popup);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 1000);
}


/**
 * Displays a modal by setting its display style property to 'block'.
 * @description This function sets the display style property of the provided modal element to 'block', making it visible.
 * @param {HTMLElement} modal - The modal element to be displayed.
 */    
function showModal(modal) {
    modal.style.display = 'block';
}

createModal('Anmeldung erfolgreich!');
        /**go to privacy_policy.html */
function redirectToPrivacyPolicy() {
    window.location.href = "privacy_policy.html";
}
        /**go to legal_notice.html */
function redirectToLegalNotice() {
    window.location.href = "legal_notice.html";
}
        /**go to SignUp.html */
function redirectToSignUp() {
    window.location.href = 'SignUp.html';
}
        /**go to summary.html */
function openSummaryHtml() {
    const targetUrl = './summary.html';
    window.location.href = targetUrl;
    Usercurrent = 'Guest';
    localStorage.setItem('Usercurrent', Usercurrent);
}
        /**go to login.html */
function goBackToLogin() {
    window.location.href = 'login.html';
}
        /**go to iforgotmypassword.html*/
function redirectToForgotPassword() {
    const targetUrl = './iforgotmypassword.html';
    window.location.href = targetUrl;
}