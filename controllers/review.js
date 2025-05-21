const Review = require("../models/review.js")
const Listing = require("../models/listing.js")


module.exports.CreateReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    req.flash("success","Review created")
    await newReview.save();
    await listing.save();

    res.redirect(`/listing/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    const { id, reviewid } = req.params;
    req.flash("success","Review Delete")
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);

    res.redirect(`/listing/${id}`);
}