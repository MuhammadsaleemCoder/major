const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js"); // Ensure your Review model is correctly defined

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true,  // The title is required for every listing
    },
    description: {
        type: String,  // Description of the listing
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60", // Default image if none provided
        set: (v) =>
            v === "" 
                ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" // Set default if empty string passed
                : v, // If image is not provided, use the default value
    },
    price: {
        type: Number,  // Price of the listing
    },
    location: {
        type: String,  // Location of the listing
    },
    country: {
        type: String,  // Country of the listing
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",  // Reference to the Review model
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Reference to the User model, represents the owner of the listing
    },
});

// This hook runs after a listing is deleted and removes all reviews associated with it
ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } }); // Delete associated reviews
    }
});

// Create and export the Listing model
const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;
