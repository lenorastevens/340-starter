const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Classification View Route
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

module.exports = router;