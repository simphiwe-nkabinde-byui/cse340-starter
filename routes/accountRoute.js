// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const accountValidate = require("../utilities/account-validation");

// Route to build account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

// Route to build account register page
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
// Route to build account login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/logout", utilities.handleErrors(accountController.logout));
// Route to build account register page
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  accountValidate.registrationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
// Process the login attempt
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get(
  "/edit/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditAccountView)
);
router.post(
  "/update/",
  utilities.checkLogin,
  accountValidate.accountRules(),
  accountValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);
router.post(
  "/update-password/",
  utilities.checkLogin,
  accountValidate.passwordRules(),
  accountValidate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
