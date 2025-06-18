const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");
const invModel = require("../models/inventory-model");
const reviewModel = require("../models/review-model");

const validate = {};

validate.reviewRules = () => {
  return [
    body("account_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Please provide a valid account"),
    body("inv_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Please provide a valid inventory item"),
    body("review_rating")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1, max: 5 })
      .withMessage("Please provide a valid rating"),
    body("review_message")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a valid message"),
  ];
};

validate.checkReviewData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(req.body);

    const inv_id = req.body.inv_id;
    const data = await invModel.getInventoryById(inv_id);
    const reviews = await reviewModel.getReviewsByInventoryId(inv_id);
    const detailBlock = await utilities.buildInventoryDetailBlock(data);
    const nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      detailBlock,
      nav,
      inv_id,
      errors,
      reviews,
    });
    return;
  }
  next();
};

module.exports = validate;
