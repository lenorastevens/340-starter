const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    if (data.rows.length === 0) {
      return null
    }
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
    throw error
  }
}

/* ***************************
 *  Get all vehicle details for an inventory item inv_id
 * ************************** */
async function getDetailsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    if (data.rows.length === 0) {
      return null
    }
    return data.rows[0]
  } catch (error) {
    console.error("getdetailsbyid error " + error)
    throw error
  }
}

/* ***************************************
 *  Insert a new classification into table
 * ************************************ */
async function insertClassification(classification_name) {
  try{
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *************************************
 *  Insert a new vehicle into inventory
 * ********************************** */
async function insertVehicle(
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) { 
  try{

    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    ])

    if (result.rowCount > 0) {
      const vehicle = result.rows[0]
      console.log("Vehicle Returned from Insert:" +vehicle)
      return vehicle      
    } else {
      console.log('Could not find vehicle.')
    }

  } catch (error) {
    console.error('Error inserting vehicle:', error.message)
    return error.message
  }
}

/* *************************************
 *  UPDATE a vehicle in inventory
 * ********************************** */
async function updateVehicle(
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id
) { 
  try{

    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"

    const result = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])

    if (result.rowCount > 0) {
      const vehicle = result.rows[0]
      console.log("Vehicle Returned from Insert:" +vehicle)
      return vehicle      
    } else {
      console.log('Could not find vehicle.')
    }

  } catch (error) {
    console.error('Error updating vehicle:', error.message)
    return error.message
  }
}

/* *************************************
 *  DELETE a vehicle from inventory
 * ********************************** */
async function deleteVehicle(
  inv_id,
  inv_make,
  inv_model,
  inv_year,
  inv_price
) { 
  try{
    const sql = "DELETE FROM inventory WHERE inv_id = $1"

    const result = await pool.query(sql, [inv_id])

    return result

  } catch (error) {
    console.error('Error updating vehicle:', error.message)
    return error.message
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getDetailsByInventoryId,
  insertClassification,
  insertVehicle,
  updateVehicle,
  deleteVehicle
}
