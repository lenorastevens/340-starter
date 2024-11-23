const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build vehicle by details view view
 * ************************** */

invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    console.log(req.params)
    const data = await invModel.getDetailsByInventoryId(inv_id)
    const grid = await utilities.buildVehicleDetailsGrid(data)
    let nav = await utilities.getNav()
    const className = + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model || "Unknown Vehicle"
    res.render("./inventory/detail", {
      title: className,
      nav,
      grid
    })
  }
  
  module.exports = invCont