import {
  addUser,
  updateUser,
  deleteUser,
  subscribeToUsers,
  checkUniqueness,
} from "./db.js";
import {
  renderUsers,
  fillForm,
  resetForm,
  getFormData,
  showAlert,
  elements,
} from "./ui.js";

// Handle Form Submission
elements.form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = getFormData();
  const { id, ...userData } = formData;

  try {
    // Check for duplicates
    const conflict = await checkUniqueness(userData.email, userData.mobile, id);
    if (conflict) {
      showAlert(conflict.message, "error");
      return;
    }

    if (id) {
      // Update existing user
      await updateUser(id, userData);
      showAlert("Member details updated successfully!");
    } else {
      // Add new user
      await addUser(userData);
      showAlert("New member registered successfully!");
    }
    resetForm();
  } catch (error) {
    console.error(error);
    showAlert(
      "An error occurred. Please check your Firebase configuration.",
      "error",
    );
  }
});

// Handle Edit Action
const handleEdit = (user) => {
  fillForm(user);
};

// Handle Delete Action
const handleDelete = async (userId) => {
  if (confirm("Are you sure you want to remove this member?")) {
    try {
      await deleteUser(userId);
      showAlert("Member removed successfully!");
    } catch (error) {
      console.error(error);
      showAlert("Failed to delete member.", "error");
    }
  }
};

// Handle Cancel Button
elements.cancelBtn.addEventListener("click", () => {
  resetForm();
});

// Subscribe to Data Updates
try {
  subscribeToUsers(
    (users) => {
      renderUsers(users, handleEdit, handleDelete);
    },
    (error) => {
      console.error("Subscription error:", error);
      elements.loader.innerHTML = `<span style="color: #ef4444;">Connection Error: ${error.message}</span>`;
    },
  );
} catch (error) {
  console.error("Setup error:", error);
  elements.loader.innerHTML =
    '<span style="color: #ef4444;">Initialization Failed. Check Firebase Settings.</span>';
}
