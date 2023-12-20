function contactTemplate() {
  return /*html*/ `
    <div class="contact-template">
    <div class="headerFromAddContact">
        <b class="closeButton" onclick="closeWindow()">X</b>
        <img class="join-img" src="./assets/img/capWhite.png" alt="Join Logo">
        <h3>Add Contact</h3>
        <p>Tasks are better with a team!</p>
    </div>
        <div class="imgContainer" >
            <img class="addLogo deaktiviert-hover " src="./assets/img/person_add.svg" alt="logoContact">
        </div>
    <form class="form-input" >
        <label for="name"></label>
        <input class="inputs-of-contacts" type="text" id="name"  placeholder="Name" required><br><br>
        
        <label for="email"></label>
        <input  class="inputs-of-contacts" type="email" id="email"  placeholder="Email" required><br><br>
        
        <label for="phone"></label>
        <input class="inputs-of-contacts" type="tel" id="phone"  placeholder="+049"  title="tel" required><br><br>
        <div>
        <div class="colorContainer">
        <label class="labelColor" for="color">Choose a color:</label>
        <select id="color" name="color">
            <option value="#FF7A00">Orange</option>
            <option value="#FF5EB3">Pink</option>
            <option value="#9747FF">Purple</option>
            <option value="#9327FF">Violet</option>
            <option value="#00BEE8">Cyan</option>
            <option value="#1FD7C1">Turquoise</option>
            <option value="#FF745E">Salmon</option>
            <option value="#FFA35E">Apricot</option>
            <option value="#FC71FF">Lavender</option>
            <option value="#FFC701">Yellow</option>
            <option value="#0038FF">Blue</option>
            <option value="#C3FF2B">Lime</option>
            <option value="#FFE62B">Gold</option>
            <option value="#FF4646">Red</option>
            <option value="#FFBB2B">Amber</option>
        </select>
    </div>
        </div>
        
        <div class="bContainer">
        <button class="contactbuttonsone" onclick="closeWindow()">Cancel &#10006;</button>
        <button class="contactbuttonsonetwo" onclick="createContact()">Create contact &#10003;</button>

        </div>
    </form>

</div>
`;
}

function generateEditTaskHTML(i, taskText) {
  return `
      <div class="edit-task-input" id="editInput"> 
        <input type="text" class="edit-task-inputfield" id="editTaskInput${i}" value="${taskText}">
        <div class="edit-task-input-icons-wrapper">
          <img src="./assets/img/Subtask's icons.svg" class="edit-task-confirm-edit-icon" alt="" onclick="saveEditedTask(${i})">
          <div class="edit-subtasks-input-icons-divider"> </div>
          <img src="./assets/img/delete.svg" class="edit-task-delete-icon" alt="" onclick="deleteCurrentTask(${i})">
        </div>
      </div>
    `;
}

function generateTaskListHTML(taskList) {
  let html = "";
  if (Array.isArray(taskList)) {
    for (let i = 0; i < taskList.length; i++) {
      const element = taskList[i].text;
      html += `
          <li class="existing-subtasks-list-item" id="listElement${i}">
            <div class="subtask-list-element">${element}</div>
            <div class="subtask-list-item-btn">
              <img src="./assets/img/edit.svg" class="edit-subtask-btn" alt="" onclick="editTask(${i})">
              <div class="subtask-list-item-divider"> </div>
              <img src="./assets/img/delete.svg" class="delete-subtask-btn" alt="" onclick="deleteCurrentTask(${i})">
            </div>
          </li>
        `;
    }
  }
  return html;
}

function contactsRender(color, initials, nameContact, i) {
  return `
    <div class="helper-for-contacts">
      <div class="asignee-row assignee" style="background: ${color}">${initials}</div>
      <div> ${nameContact} </div>
      <div>
        <input type="checkbox" class="contact-checkbox" id="check${i}">
        <img class="checkbox-image" id="checkbox-${i}" src="./assets/img/checkbox.svg">
      </div>
      </div>
    `;
}
