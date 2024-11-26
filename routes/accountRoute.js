const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Account View Route
router.get("/login", utilities.handleErrors(accountController.buildLoginView))

module.exports = router;