const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const detCont = {}

/* ***************************
 *  Build vehicle by details view view
 * ************************** */

detCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId

    if (isNaN(inv_id) || inv_id <= 0) {
      console.error("Invalid inventory ID:", req.params.inventoryId);
      const error = new Error("Invalid inventory ID. Must be a positive number.");
      error.status = 400; // Bad Request
      next(error);
      return;
    }

    try {
      const data = await invModel.getDetailsByInventoryId(inv_id)

      if (!data) {
        const error = new Error("Vehicle not found")
        error.status = 404
        next(error)
        return
      }
    
      const grid = await utilities.buildVehicleDetailsGrid(data)
      let nav = await utilities.getNav()
      const className = + data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model || "Unknown Vehicle"
      res.render("./inventory/detail", {
        title: className,
        nav,
        grid
      })
    } catch (error) {
      console.error("Error in buildByInventoryId:", error)
    }
}
  
  module.exports = detCont