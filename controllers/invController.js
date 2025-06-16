const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getInventoryById(inventory_id);
  const detailBlock = await utilities.buildInventoryDetailBlock(data);
  const nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    detailBlock,
    nav,
  });
};

invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: `Inventory Management`,
    nav,
    classificationSelect,
  });
};

invCont.buildAddClassificationView = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: `Add Classification`,
    nav,
    errors: null,
  });
};

invCont.buildAddInventoryView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: `Add Inventory`,
    nav,
    classificationSelect,
    errors: null,
  });
};

invCont.AddClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const classificationResult = await invModel.createClassification(
    classification_name
  );

  const nav = await utilities.getNav();

  if (classificationResult) {
    req.flash("notice", `${classification_name} Classification added`);
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } else {
    req.flash("notice", "Failed to add Classification");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
  res.render("./inventory/add-classification", {
    title: `Add Classification`,
    nav,
    errors: null,
  });
};

invCont.AddInventory = async function (req, res, next) {
  const inventoryResult = await invModel.createInventory(req.body);
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  if (inventoryResult) {
    req.flash(
      "notice",
      `${req.body.inv_make} ${req.body.inv_model} added to inventory`
    );
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } else {
    req.flash("notice", "Failed to add inventory");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      errors: null,
    });
  }
  res.render("./inventory/add-inventory", {
    title: `Add Inventory`,
    nav,
    classificationSelect,
    errors: null,
  });
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont;
