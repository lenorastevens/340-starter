const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res, next) {
  try {
    let nav = await utilities.getNav()

    res.render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } catch (error) {
    console.error("Error building login view:", error);
    res.status(500).send("An error occurred while loading the login page.");
  }
}

async function buildRegisterView(req, res, next) {
  try{
    let nav = await utilities.getNav()

    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  } catch (error) {
    console.error("Error building login view:", error);
    res.status(500).send("An error occurred while building registration view.");
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )

    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* *************************
*  Process Registration
* *********************** */
async function checkLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password} = req.body

  const userData = await accountModel.checkLogin(account_email)

  if (account_password === userData.account_password) {
    req.flash(
      "notice",
      `Login for ${userData.account_firstname} was sucessful. Enjoy the site!`
    )
    res.status(201).render("account/login", {
      title: "Login", 
      nav,
      errors:null
    })

  } else {
    req.flash("notice", "Sorry, the login failed. Please try again.")
    res.status(501).render("account/login", {
      title: "Login",
      nav
    })
  }
}
  
module.exports = { buildLoginView, buildRegisterView, registerAccount, checkLogin }