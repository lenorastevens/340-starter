const express = require("express")
const router = express.Router() 
const errorCont = require("../controllers/fakeErrorController")

router.get("/fakeError", errorCont.buildFakeErrorByLink);

module.exports = router;