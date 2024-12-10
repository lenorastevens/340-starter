const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel= require("../models/inventory-model")
const accountModel = require('../models/account-model')

/* **********************************
*  Review Data Validation Rules
* ********************************* */
validate.reviewRules = () => {
    return [
    // Description is required and must be string
    body("review_text")
    .trim()
    .notEmpty()
    .isLength({ min: 3, max: 350 })
    .withMessage("Please provide a valid review.")
    ]
}

validate.checkReviewData = async (req, res, next) => {
    const { review_text, account_id, inv_id } = req.body 
    
    let errors = []

    errors = validationResult(req)

    if (!errors.isEmpty()) {
        try {
            let nav = await utilities.getNav()
            
            let reveiws = await accountModel.getReviewsByActId(account_id)
            let actReviewList = await utilities.buildActReviewList(reveiws)

            res.render("account/management", {
                title: "Account Management",
                nav,
                errors: null,
                actReviewList
            })
        } catch (err) {
            console.error("Error fetching necessary data for rendering:", err)
            return next(err)
        }
    }
    next()
}

validate.checkReviewEdit = async (req, res, next) => {
    const { review_text, account_id, inv_id, review_id } = req.body 

    let errors = []

    errors = validationResult(req)

    if (!errors.isEmpty()) {
        try {
            const nav = await utilities.getNav();
            const vehicleData = await invModel.getDetailsByInventoryId(inv_id)
            const reviews = await accountModel.getReviewsByActId(account_id)
            const accountData= res.locals.accountData

            return res.render("account/management", {
                title: 
                nav,
                errors: errors.array(),
                accountData,
                reviews,
                vehicleData
            })

        } catch (err) {
            console.error("Error fetching necessary data for rendering:", err)
            return next(err)
        }
    }
    next()

}

module.exports = validate