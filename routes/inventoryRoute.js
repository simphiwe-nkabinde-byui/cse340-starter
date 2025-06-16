// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");
const authorization = require("../utilities/authorization");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);
router.get(
  "/",
  authorization.AdminEmployeeOnly,
  utilities.handleErrors(invController.buildManagementView)
);
router.get(
  "/add-classification",
  authorization.AdminEmployeeOnly,
  utilities.handleErrors(invController.buildAddClassificationView)
);
router.get(
  "/add-inventory",
  authorization.AdminEmployeeOnly,
  utilities.handleErrors(invController.buildAddInventoryView)
);
router.get(
  "/edit/:inventoryId",
  authorization.AdminEmployeeOnly,
  utilities.handleErrors(invController.buildEditInventoryView)
);
router.get(
  "/delete/:inventoryId",
  authorization.AdminEmployeeOnly,
  utilities.handleErrors(invController.buildDeleteInventoryView)
);
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);
router.post(
  "/add-classification",
  authorization.AdminEmployeeOnly,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.AddClassification)
);
router.post(
  "/add-inventory",
  authorization.AdminEmployeeOnly,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.AddInventory)
);
router.post(
  "/update/",
  invValidate.inventoryRules(),
  authorization.AdminEmployeeOnly,
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);
router.post(
  "/delete/",
  authorization.AdminEmployeeOnly,
  utilities.handleErrors(invController.deleteInventory)
);
module.exports = router;
