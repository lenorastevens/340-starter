const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = `<ul id="myTopNav">`
  list += '<li class="topnav"><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += `<li class="topnav">`
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li class="vehicle-card">'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Picture of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +'"></a>'
        grid += '<div class="namePrice">'
        grid += '<hr >'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span class="vehicle-price">$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }  

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */

Util.buildVehicleDetailsGrid = async function (details) {
  let grid; 
  
  try {
    if (details && details.inv_make) {
      grid = `
        <div id="vehicle-container">
          <div>
            <img class="vehicle-img" src=" ${details.inv_image}" alt="Picture of ${details.inv_make} ${details.inv_model}" >        
          </div>
          <div>
            <h2 id="detail-title">${details.inv_make} ${details.inv_model} Details</h2>
            <h3 class="detail-labels"><span class="first-word">Price: </span><span>$${new Intl.NumberFormat('en-US').format(details.inv_price)}</span></h3
            <h3 class="detail-labels"><span class="first-word">Description: </span><span>${details.inv_description}</span></h3>
            <h3 class="detail-labels"><span class="first-word">Color: </span><span>${details.inv_color}</span></h3>
            <h3 class="detail-labels"><span class="first-word">Miles: </span><span>${new Intl.NumberFormat('en-US').format(details.inv_miles)}</span></h3>
          </div>
        </div>
        `;
    } else {
      grid = `
        <div id="vehicle-container">
          <p class="notice">Sorry, vehicle details could not be found or are incomplete.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error generating vehicle details grid:", error);
    grid = `
      <div id="vehicle-container">
        <p class="notice">An error occurred while fetching vehicle details. Please try again later.</p>
      </div>
    `;
  }
  return grid
}

Util.buildClassificationList = async function () {
  let data = await invModel.getClassifications()
  return data.rows
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next) 

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
      if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
      return res.redirect("/account/login")
      }
      res.locals.accountData = {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type
      }
      res.locals.loggedin = 1
      next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util