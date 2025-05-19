const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejs_mate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");

// Models and Utilities
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");
const wrapAsync = require("./utiles/wrapAsync.js");
const ExpressError = require("./utiles/ExpressError.js");
const { listingschema, reviewSchema } = require("./schema.js");

// Routes
const route = require("./route/listing.js");
const reviews = require("./route/review.js");
const users = require("./route/user.js");

//  Mongoose Connection
const MONGO_URL = 'mongodb://127.0.0.1:27017/Wanderlust';
main()
  .then(() => { console.log("MongoDB connection successful"); })
  .catch((err) => { console.log("MongoDB connection error", err); });

async function main() {
  await mongoose.connect(MONGO_URL);
}
//  View Engine and Static Files
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejs_mate);
app.use(express.static(path.join(__dirname, "/public"))); 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session & Flash
const sessionOption = {
  secret: "mycode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash());

//  Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  Flash Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

//  Routes
app.use("/", users);
app.use("/listing", route);
app.use("/listing/:id/review", reviews);

//  Home Route
app.get("/", (req, res) => {
  res.send("Home Page");
});

//  404 Handler
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//  Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

//  Start Server
app.listen(3000, () => {
  console.log("App is listening on port 3000");
});