const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Account View Route
router.get("/login", utilities.handleErrors(accountController.buildLoginView))
router.get("/register", utilities.handleErrors(accountController.buildRegisterView))

module.exports = router;