const express = require("express")
const router = new express.Router() 
const managementController = require("../controllers/managementController")
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classValidate = require("../utilities/classification-validation")
const vehicleValidate = require("../utilities/vehicle-validation")

// Management View Route
router.get("/", utilities.handleErrors(managementController.buildInvManagement))
router.get("/addClassification", utilities.handleErrors(managementController.addNewClassification))
router.get("/addInventory", utilities.handleErrors(managementController.addNewInventory))

// Classification View Route
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

router.post(
    '/addClassification',
    classValidate.classificationRules(),
    classValidate.checkClassData,
    utilities.handleErrors(managementController.insertNewClassification)
)

router.post(
    '/addInventory',
    vehicleValidate.vehicleRules(),
    vehicleValidate.checkVehicleData,
    utilities.handleErrors(managementController.insertNewVehicle)
)

module.exports = router;