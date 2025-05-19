const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const ExpressError = require("./utiles/ExpressError.js");
const { listingschema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;  // ✅ corrected spelling from `orignalUrl`
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");  
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id); 
    if (!req.user || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit this listing.");
        return res.redirect(`/listing/${id}`); 
    }
    next();
};

// ✅ Validate listing data
module.exports.validatelisting = (req, res, next) => {
    let { error } = listingschema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};
// ✅ Middleware to validate review
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id,reviewid } = req.params;
    let review = await Review.findById(reviewid); 
    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to edit this Review.");
        return res.redirect(`/listing/${id}`); 
    }
    next();
};
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findById(reviewId);
  req.flash("success", "review deleted successfully...");

  res.redirect(`/listings/${id}`);
};

