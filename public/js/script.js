const passwordToggleBtn = document.querySelector("#password-display-toggle");
passwordToggleBtn.addEventListener("click", function () {
  const passwordInput = document.querySelector("#password");
  const type = passwordInput.type;
  if (type == "password") {
    passwordInput.type = "text";
    passwordToggleBtn.textContent = "hide";
  } else {
    passwordInput.type = "password";
    passwordToggleBtn.textContent = "show";
  }
});
