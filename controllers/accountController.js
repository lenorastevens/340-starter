const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res, next) {
  try {
    let nav = await utilities.getNav()
    
    const notice = req.flash("notice")[0] || null;

    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      notice,
    });
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
    errors: null,
  });
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

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )

    res.status(201).render("account/login", {
      title: "Login",
      nav,
      notice: req.flash("notice")[0],
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      notice: req.flash("notice")[0]
    })
  }
}

  
  module.exports = { buildLoginView, buildRegisterView, registerAccount }