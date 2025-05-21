const User = require("../models/user.js")

module.exports.login =(req, res) => {
    res.render("users/login.ejs");
};

module.exports.renderSignup=(req, res) => {
    res.render("users/Signup.ejs");
};

module.exports.signup =async (req, res, next) => {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listing");
    });
};

module.exports.loginHandle =     async(req, res) => {
        req.flash("success", "Welcome back!");
        const redirectUrl = res.locals.redirectUrl || "/listing"; // ✅ fixed line
        res.redirect(redirectUrl);
    };

module.exports.logout=(req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        req.flash("success", "You successfully logged out");
        res.redirect("/listing");
    });
}