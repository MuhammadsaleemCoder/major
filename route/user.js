const express = require("express");
const route = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utiles/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// Signup form
route.get("/signup", (req, res) => {
    res.render("users/Signup.ejs");
});

// Handle signup
route.post("/signup", wrapAsync(async (req, res, next) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listing");
    });
}));

// Login form
route.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Handle login
route.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        const redirectUrl = res.locals.redirectUrl || "/listing"; // ✅ fixed line
        res.redirect(redirectUrl);
    }
);

// Logout
route.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash("success", "You successfully logged out");
        res.redirect("/listing");
    });
});

module.exports = route;
