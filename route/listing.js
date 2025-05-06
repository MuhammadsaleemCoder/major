const express = require("express");
const route = express.Router();
const wrapAsync = require("../utiles/wrapAsync.js");
const ExpressError = require("../utiles/ExpressError.js");
const { listingschema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


// ✅ Validate listing data
const validatelisting = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// ✅ Validate review data (you already had this)
const reviewlisting = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// ✅ Create a new listing
route.post("/", validatelisting, wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");
}));

// ✅ Get listing by ID
route.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("show.ejs", { listing });
}));

// ✅ Edit listing form
route.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("edit.ejs", { listing });
}));

// ✅ Update listing
route.put("/:id", validatelisting, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listing");
}));

// ✅ Delete listing
route.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

// ✅ Get all listings
route.get("/", wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("index.ejs", { alllisting });
}));

// ✅ Show form to create a new listing
route.get("/new", (req, res) => {
    res.render("new.ejs");
});

module.exports = route;
