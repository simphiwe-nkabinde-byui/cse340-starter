// Needed Resources
const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");
const reviewValidate = require("../utilities/review-validation");

// Route to build inventory by classification view
router.get(
  "/inv/:inventory_id",
  utilities.handleErrors(reviewController.getInventoryReviews)
);
router.post(
  "/add-review",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
);

module.exports = router;
