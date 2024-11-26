// const utilities = require("../utilities")

const errorCont = {}

errorCont.buildFakeErrorByLink = async function (req, res, next) {
  const fakeError = new Error("Intentional Error Demo")
  fakeError.status = 500
  next(fakeError)
}

module.exports = errorCont