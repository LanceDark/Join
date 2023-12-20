const STORAGE_TOKEN = '3KR8NDCYECJ9GOUZ12UQQHMLLAMIYOTERR7HKYU8';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
const assigneeColors = ['#FF7A00', '#FF5EB3', '#9747FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];

/**
 * Sets an item in the storage.
 * @description This function sends a POST request to the storage API to set an item.
 * @param {string} key - The key for the storage item.
 * @param {string} value - The value to be stored.
 * @returns {Promise} A promise that resolves to the response from the storage API.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Gets an item from the storage.
 * @description This function sends a GET request to the storage API to retrieve an item.
 * @param {string} key - The key for the storage item.
 * @returns {Promise} A promise that resolves to the value of the retrieved item.
 * @throws Will throw an error if the item with the specified key is not found.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}


/**back to login.html */
function goBackToLogin() {
    window.location.href = 'login.html';
}
/**go to privacy_policy.html */
function redirectToPrivacyPolicy() {
    window.location.href = "privacy_policy.html";
}
/* go to legal_notice.html */
function redirectToLegalNotice() {
    window.location.href = "legal_notice.html";
}



