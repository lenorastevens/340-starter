const express = require("express")
const router = new express.Router()
const detailController = require("../controllers/detailController")
const utilities = require("../utilities/")

// Route to build details by inventory id
router.get("/:inventoryId", utilities.handleErrors(detailController.buildByInventoryId));

module.exports = router;
