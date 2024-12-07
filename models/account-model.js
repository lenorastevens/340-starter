const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

/* ***************************
 *   Check for existing email
 * ************************ */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

/* *************************
*  Check Login Data
* *********************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = 'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1'

    const result = await pool.query(sql, [account_email])

    if (result.rowCount > 0) {
      const user = result.rows[0];
      return user
    } else {
      console.log("No user found with that email.")
    }
  } catch (error) {
    return error.message
  }
}

/* *************************
*  Get Account Data by ID
* *********************** */
async function getAccountByAccountId(account_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.account WHERE account_id = $1`,
      [account_id]
    )
    if (data.rows.length === 0) {
      return null
    }
    return data.rows[0]
  } catch (error) {
    console.error("Get account by id error: " + error)
    throw error
  }
}

/* **********************
*  Edit Account Data 
* ******************** */
async function editAccount(
  account_id,
  account_firstname,
  account_lastname,
  account_email,
) {
  try {
    const sql = `UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *`
    const result = await pool.query(sql, [
      account_firstname, 
      account_lastname,
      account_email,
      account_id
    ])
  
    if (result.rowCount > 0) {
      const account = result.rows[0]
      return account
    } else {
      console.log('Could not find account.')
    }

  } catch (error) {
    console.error('Error updating account:', error.message)
    return error.message
  }
  
}

/* **********************
*  Edit Account Password 
* ******************** */
async function editPassword(
  account_id,
  account_password
) {
  
  try {
    const sql = `UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING account_id, account_firstname, account_lastname`
    const result = await pool.query(sql, [account_password, account_id])

    const account = result.rows[0]
    console.log(account)
    
    return account
    
  } catch (error) {
    console.error("Error updating password", error.message)
    return error.message
  }

}

  module.exports = { 
    registerAccount, 
    checkExistingEmail, 
    getAccountByEmail, 
    getAccountByAccountId, 
    editAccount,
    editPassword 
  }