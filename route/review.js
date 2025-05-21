const express = require("express");

const route = express.Router({mergeParams:true});
const wrapAsync = require("../utiles/wrapAsync.js");
const ExpressError = require("../utiles/ExpressError.js");
const { listingschema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor,deleteReview} = require("../middleware.js")
const reviewController = require("../controllers/review.js")




// ✅ Add a review to a specific listing
route.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.CreateReview));

// ✅ Delete a specific review from a listing
route.delete("/:reviewid",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));



module.exports = route;