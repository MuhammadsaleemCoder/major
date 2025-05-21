const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utiles/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js")

router.route("/signup")
.get(userController.renderSignup)   
.post(wrapAsync(userController.signup))


router.route("/login")
.get( userController.login)
.post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
userController.loginHandle
);


// Logout
router.get("/logout", userController.logout);

module.exports = router;
