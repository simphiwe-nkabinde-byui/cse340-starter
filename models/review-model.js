const pool = require("../database");

async function getReviewsByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.review AS r
      JOIN public.account AS a
      ON r.account_id = a.account_id
      WHERE r.inv_id = $1`,
      [inventory_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getreviewsbyinventoryid error " + error);
  }
}

async function createReview(review) {
  const { account_id, inv_id, review_message, review_rating } = review;
  try {
    const sql = `INSERT INTO public.review (account_id, inv_id, review_message, review_rating) VALUES ($1, $2, $3, $4) RETURNING *`;
    return await pool.query(sql, [
      account_id,
      inv_id,
      review_message,
      review_rating,
    ]);
  } catch (error) {
    console.error("createReview error ", error)
  }
}

module.exports = { getReviewsByInventoryId, createReview };
