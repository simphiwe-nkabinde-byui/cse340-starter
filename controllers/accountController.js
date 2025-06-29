const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", { title: "Login", nav, errors: null });
}
/* ****************************************
 *  Deliver register view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", { title: "Register", nav, errors: null });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function loginUser(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const loginResult = await accountModel.loginUser(
    account_email,
    account_password
  );

  if (loginResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.redirect("/");
  } else {
    req.flash("notice", "Sorry, the login failed.");
    res.status(501).render("account/login", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  console.log("ACCOUNT LOGIN");
  console.log("BODY:", req.body);

  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

async function logout(req, res) {
  res.clearCookie("jwt");
  return res.redirect("/");
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildEditAccountView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    ...res.locals.accountData,
  });
}

async function updateAccount(req, res, next) {
  const nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    delete updateResult.account_password;
    const accessToken = jwt.sign(
      updateResult,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 3600 * 1000,
      }
    );
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }

    req.flash("notice", `Your account was successfully updated.`);
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      ...req.body,
    });
  }
}

async function updatePassword(req, res, next) {
  const nav = await utilities.getNav();
  const { account_password, account_id } = req.body;
  const accountData = await accountModel.getAccountById(account_id);

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", "Sorry, there was an error updating the password.");
    res.status(500).render("account/register", {
      title: "account/edit",
      nav,
      errors: null,
      ...accountData,
    });
  }

  const updateResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );

  if (updateResult) {
    req.flash("notice", `Your password was successfully updated.`);
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the password update failed.");
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      errors: null,
      ...accountData,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginUser,
  accountLogin,
  buildManagement,
  logout,
  buildEditAccountView,
  updateAccount,
  updatePassword,
};
