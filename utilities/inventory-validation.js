const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

const validate = {};
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isAlphanumeric()
      .withMessage("Please provide a valid classification name"),
  ];
};
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Please provide a valid classification"),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid make"),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid model"),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1885, max: new Date().getFullYear() })
      .withMessage("Please provide a valid year"),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid year"),
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid image path"),
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid thumbnail path"),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price"),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide a valid miles"),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid color"),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
    });
    return;
  }
  next();
};

validate.checkInventoryData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(req.body?.classification_id);
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      classificationSelect,
      invValues: req.body,
      nav,
    });
    return;
  }
  next();
};

module.exports = validate;
