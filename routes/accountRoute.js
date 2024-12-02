const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const logValidate = require('../utilities/login-validation')

// Account View Route
router.get(
    "/",
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildAcctManagement)
)
router.get("/login", utilities.handleErrors(accountController.buildLoginView))
router.get("/register", utilities.handleErrors(accountController.buildRegisterView))

// Process Registration Post method
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process login to verify login data
router.post(
    '/login',
    logValidate.loginRules(), 
    logValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)


module.exports = router;