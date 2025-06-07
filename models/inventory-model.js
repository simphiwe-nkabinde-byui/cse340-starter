const pool = require("../database");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get inventory by classification id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationbyid error " + error);
  }
}

/* ***************************
 *  Get inventory record by inventory id
 * ************************** */
async function getInventoryById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inventory_id]
    );
    return data?.rows[0];
  } catch (error) {
    console.error("getinventorybyid error " + error);
  }
}

async function createClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name ) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

async function createInventory(inventory) {
  const fields = Object.keys(inventory);
  try {
    const sql = `INSERT INTO public.inventory (${fields.toString()}) VALUES (${fields
      .map((f, i) => `$${i + 1}`)
      .toString()}) RETURNING *`;
    return await pool.query(
      sql,
      fields.map((f) => inventory[f])
    );
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  createClassification,
  createInventory,
};
