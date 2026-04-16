/**
 * UI Service to handle DOM manipulation
 */

const elements = {
  form: document.getElementById("registration-form"),
  formTitle: document.getElementById("form-title"),
  submitBtn: document.getElementById("submit-btn"),
  cancelBtn: document.getElementById("cancel-btn"),
  userId: document.getElementById("user-id"),
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  mobile: document.getElementById("mobile"),
  usersList: document.getElementById("users-list"),
  noData: document.getElementById("no-data"),
  loader: document.getElementById("loader"),
};

/**
 * Render the list of users in the table
 */
export const renderUsers = (users, onEdit, onDelete) => {
  elements.loader.classList.add("hidden");
  elements.usersList.innerHTML = "";

  if (users.length === 0) {
    elements.noData.classList.remove("hidden");
    return;
  }

  elements.noData.classList.add("hidden");

  users.forEach((user, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
            <td class="action-btns">
                <button class="edit-btn" data-id="${user.id}">Edit</button>
                <button class="delete-btn" data-id="${user.id}">Delete</button>
            </td>
        `;

    // Attach event listeners
    tr.querySelector(".edit-btn").onclick = () => onEdit(user);
    tr.querySelector(".delete-btn").onclick = () => onDelete(user.id);

    elements.usersList.appendChild(tr);
  });
};

/**
 * Fill the form with user data for editing
 */
export const fillForm = (user) => {
  elements.formTitle.innerText = "Edit Member Details";
  elements.userId.value = user.id;
  elements.name.value = user.name;
  elements.email.value = user.email;
  elements.mobile.value = user.mobile;
  elements.submitBtn.innerText = "Update Member";
  elements.cancelBtn.classList.remove("hidden");
  elements.name.focus();
};

/**
 * Reset the form to its initial state
 */
export const resetForm = () => {
  elements.form.reset();
  elements.formTitle.innerText = "Register New Member";
  elements.userId.value = "";
  elements.submitBtn.innerText = "Register Member";
  elements.cancelBtn.classList.add("hidden");
};

/**
 * Get form data as an object
 */
export const getFormData = () => {
  return {
    id: elements.userId.value,
    name: elements.name.value.trim(),
    email: elements.email.value.trim(),
    mobile: elements.mobile.value.trim(),
  };
};

/**
 * Show a simple alert (can be upgraded to a custom modal later)
 */
export const showAlert = (message, type = "success") => {
  // Basic browser alert for now, but UI is clean enough
  alert(message);
};

export { elements };
