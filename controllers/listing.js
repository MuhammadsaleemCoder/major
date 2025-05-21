const Listing = require("../models/listing.js")


module.exports.index = async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("index.ejs", { alllisting });
};

module.exports.Update =async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated successfully.");
    res.redirect(`/listing/${id}`);
};
module.exports.NewForm = (req, res) => {
    res.render("new.ejs");
};

module.exports.showListing = (async (req, res) => {
    // Ensure the logged-in user’s ID is set as the owner
    const newlisting = new Listing({
        ...req.body.listing,  // Extract all the listing data from the request body
        owner: req.user._id,   // Set the current logged-in user's ID as the owner
    });

    await newlisting.save();  // Save the new listing to the database

    req.flash("success", "New Listing Created");
    res.redirect("/listing");
});

module.exports.creatList = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not available");
        return res.redirect("/listing");
    }

    res.render("edit.ejs", { listing });
};



module.exports.Delete = async (req, res) => {
    let { id } = req.params;
    req.flash("success", "Listing Deleted");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}

module.exports.GetId =async (req, res) => {
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
}


















