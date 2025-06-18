const reviewsModel = require("../models/review-model");

async function getInventoryReviews(req, res, next) {
  const inventory_id = parseInt(req.params.inventory_id);
  const reviewsData = await reviewsModel.getReviewsByInventoryId(inventory_id);

  if (reviewsData) {
    return res.json(reviewsData);
  } else {
    next(new Error("No data returned"));
  }
}

async function addReview(req, res, next) {
  const reviewResult = await reviewsModel.createReview(req.body);
  const inventory_id = req.body.inv_id;

  if (reviewResult) {
    req.flash("notice", `review added`);
    return res.redirect(`/inv/detail/${inventory_id}`);
  }
  req.flash("notice", "Failed to add review");
  return res.redirect(`/inv/detail/${inventory_id}`);
}

module.exports = { getInventoryReviews, addReview };
