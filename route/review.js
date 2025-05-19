const express = require("express");

const route = express.Router({mergeParams:true});
const wrapAsync = require("../utiles/wrapAsync.js");
const ExpressError = require("../utiles/ExpressError.js");
const { listingschema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor,deleteReview} = require("../middleware.js")






// ✅ Add a review to a specific listing
route.post("/", isLoggedIn,validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    req.flash("success","Review created")
    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${listing._id}`);
}));

// ✅ Delete a specific review from a listing
route.delete("/:reviewid",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewid } = req.params;
    req.flash("success","Review Delete")
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);

    res.redirect(`/listing/${id}`);
}));



module.exports = route;