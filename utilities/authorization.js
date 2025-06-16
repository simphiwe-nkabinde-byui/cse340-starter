async function AdminEmployeeOnly(req, res, next) {
  if (res.locals.loggedin) {
    const { account_type } = res.locals.accountData;
    if (account_type == "Admin" || account_type == "Employeee") {
      return next();
    }
  }
  req.flash("notice", "You need to be logged in as an admin or employee to access the resource.");
  return res.redirect("/account/login");
}

module.exports = { AdminEmployeeOnly };
