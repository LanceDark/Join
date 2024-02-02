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
