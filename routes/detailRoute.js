const express = require("express")
const router = new express.Router()
const detailController = require("../controllers/detailController")

// Route to build details by inventory id
router.get("/:inventoryId", detailController.buildByInventoryId);

module.exports = router;
