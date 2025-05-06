const express = require("express");

const route = express.Router({mergeParams:true});
const wrapAsync = require("../utiles/wrapAsync.js");
const ExpressError = require("../utiles/ExpressError.js");
const { listingschema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


// ✅ Middleware to validate review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



// ✅ Add a review to a specific listing
route.post("/", validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${listing._id}`);
}));

// ✅ Delete a specific review from a listing
route.delete("/:reviewid", wrapAsync(async (req, res) => {
    const { id, reviewid } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);

    res.redirect(`/listing/${id}`);
}));

module.exports = route;