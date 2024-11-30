const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

async function buildInvManagement(req, res, next) {
    try {
      let nav = await utilities.getNav()
  
      res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null
      })
    } catch (error) {
      console.error("Error building management view:", error);
      res.status(500).send("An error occurred while loading the management page.");
    }
}

async function addNewClassification(req, res, next) {
    try {
      let nav = await utilities.getNav()
  
      res.render("./inventory/addClassification", {
        title: "Add New Classification",
        nav,
        errors: null
      })
    } catch (error) {
      console.error("Error building add new classification view:", error);
      res.status(500).send("An error occurred while loading the add new classification page.");
    }
}

async function addNewInventory(req, res, next) {
    try {
      let nav  = await utilities.getNav()
      let classifications = await utilities.buildClassificationList()
  
      res.render("./inventory/addInventory", {
        title: "Add New Vehicle",
        nav,
        classifications,
        errors: null
      })
    } catch (error) {
      console.error("Error building add new vehicle view:", error);
      res.status(500).send("An error occurred while loading the add new inventory page.");
    }
}

/* *************************
*  Process Adding Inventory
* *********************** */

async function insertNewClassification(req, res) {
    const { classification_name } = req.body

    const result = await invModel.insertClassification(classification_name)
    if (result) {
        let nav = await utilities.getNav()

        req.flash(
            "notice",
            `Congratulations, you added ${classification_name} to classifications.`
        )
        res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null
        })
    } else {
        let nav = await utilities.getNav()

        req.flash("notice", "Sorry, adding the classification failed.")
        res.status(501).render("./inventory/addClassification", {
            title: "Add New Classification",
            nav,
        })    
    }
}

async function insertNewVehicle(req, res) {
    let nav = await utilities.getNav()

    const { inv_make, inv_model,inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body 

    const imagePath = `/images/vehicles/${inv_image}`
    const thumbnailPath = `/images/vehicles/${inv_thumbnail}`

    const vehicleResult = await invModel.insertVehicle(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        imagePath,
        thumbnailPath,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )

    if (vehicleResult) {
        req.flash(
            "notice",
            `Congratulations! You have added the ${vehicleResult.inv_make} ${vehicleResult.inv_model} to the inventory.`
        )
        console.log(vehicleResult)
        res.status(201).render("./inventory/management", {
            title: "Inventory Management",
            nav,
            errors: null
        })
    } else {
        req.flash("notice", "Sorry, adding the vehicle failed.")
        res.status(501).render("./inventory/addInventory", {
            title: "Add New Vehicle",
            nav,
        })  
    }

}


module.exports = { 
    buildInvManagement, 
    addNewClassification, 
    addNewInventory, 
    insertNewClassification, 
    insertNewVehicle 
}