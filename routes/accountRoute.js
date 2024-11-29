const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')
const logValidate = require('../utilities/login-validation')

// Account View Route
router.get("/login", utilities.handleErrors(accountController.buildLoginView))
router.get("/register", utilities.handleErrors(accountController.buildRegisterView))

// Process Registration Post method
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
// router.post(
//     "/login",
//     (req, res) => {
//       res.status(200).send('login process')
//     }
//   )

// Possible way to check login
router.post(
    '/login',
    logValidate.loginRules(), 
    logValidate.checkLoginData,
    utilities.handleErrors(accountController.checkLogin))


module.exports = router;