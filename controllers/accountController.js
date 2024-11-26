const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLoginView(req, res, next) {
  try {
    let nav = await utilities.getNav()
    
    const form = await utilities.buildLogin()

    res.render("account/login", {
      title: "Login",
      nav,
      form
    });
  } catch (error) {
    console.error("Error building login view:", error);
    res.status(500).send("An error occurred while loading the login page.");
  }
}
  
  module.exports = { buildLoginView }