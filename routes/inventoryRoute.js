// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));
router.get("/", utilities.handleErrors(invController.buildManagementView));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInventoryView));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.AddClassification)
);
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.AddInventory)
);
router.post("/update/",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)
;
module.exports = router;
