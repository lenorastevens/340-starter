const invModel = require("../models/inventory-model")
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
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" ></a>'
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
            <img class="vehicle-img" src=" ${details.inv_image}" alt="Image of ${details.inv_make} ${details.inv_model} on CSE Motors" >        
          </div>
          <div>
            <h3 id="detail-title">${details.inv_make} ${details.inv_model} Details</h3>
            <h4 class="detail-labels"><span class="first-word">Price: </span><span>$${new Intl.NumberFormat('en-US').format(details.inv_price)}</span></h4>
            <h4 class="detail-labels"><span class="first-word">Description: </span><span>${details.inv_description}</span></h4>
            <h4 class="detail-labels"><span class="first-word">Color: </span><span>${details.inv_color}</span></h4>
            <h4 class="detail-labels"><span class="first-word">Miles: </span><span>${new Intl.NumberFormat('en-US').format(details.inv_miles)}</span></h4>
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

/* **************************************
* Build the account login view HTML
* ************************************ */
Util.buildLogin = async function () {
  console.log("getting view")
  let form;
  form = `
  <form class="form-container">
    <label class="login">Email:
      <input type="text" placeholder="enter@validEmail.com" name="account_email" required>
    </label>
    

    <label class="login">Password: 
    <input type="password" placeholder="xxx123" name="account_password" required>
    </label>
    
    <button id="login-btn" type="submit">Login</button>
    <span class="register">No account? <a href="#">Sign-Up</a></span>
  </form>
  `;
  return form
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next) 

module.exports = Util