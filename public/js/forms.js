const updateForms = document.querySelectorAll(".update-form");
for (let i = 0; i < updateForms.length; i++) {
  const updateForm = updateForms[i];
  updateForm.addEventListener("change", function () {
    const updateBtn = updateForm.querySelector("input[type='submit']");
    updateBtn.removeAttribute("disabled");
  });
}
