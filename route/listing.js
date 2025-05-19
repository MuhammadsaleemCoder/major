const express = require("express");
const route = express.Router();
const wrapAsync = require("../utiles/wrapAsync.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isOwner,
 validatelisting,
  validateBooking,
} = require("../middleware.js");




// ✅ Show form to create a new listing
route.get("/new", isLoggedIn, (req, res) => {
    res.render("new.ejs");
});

// ✅ Create a new listing
route.post("/", validatelisting, wrapAsync(async (req, res) => {
    // Ensure the logged-in user’s ID is set as the owner
    const newlisting = new Listing({
        ...req.body.listing,  // Extract all the listing data from the request body
        owner: req.user._id,   // Set the current logged-in user's ID as the owner
    });

    await newlisting.save();  // Save the new listing to the database

    req.flash("success", "New Listing Created");
    res.redirect("/listing");
}));

// ✅ Get listing by ID
route.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: { path: "author" },
  })
  .populate("owner");

    if (!listing) {
        req.flash("error", "Listing not available");
        return res.redirect("/listing");
    }

    console.log(listing); // Optional debug log
    res.render("show.ejs", {
        listing,
        currUser: req.user  // ✅ Pass currUser to the view
    });
}));

// ✅ Edit listing form
route.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not available");
        return res.redirect("/listing");
    }

    res.render("edit.ejs", { listing });
}));


// ✅ Update listing
route.put("/:id", isLoggedIn, isOwner,validatelisting, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully.");
    res.redirect(`/listing/${id}`);
}));

// ✅ Delete listing
route.delete("/:id", isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    req.flash("success", "Listing Deleted");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

// ✅ Get all listings
route.get("/", wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("index.ejs", { alllisting });
}));

module.exports = route;
