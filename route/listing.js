const express = require("express");
const router = express.Router();
const wrapAsync = require("../utiles/wrapAsync.js");
const multer  = require('multer')

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  isLoggedIn,
  isOwner,
 validatelisting,
  validateBooking,
} = require("../middleware.js");
const ListingController = require("../controllers/listing.js")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

router.route("/")
.get( wrapAsync(ListingController.index))
// .post(isLoggedIn, validatelisting, wrapAsync(ListingController.showListing))
.post( upload.single('listing[image]'),(req , res)=>{
  res.send(req.file);
})
router.get("/new",  ListingController.NewForm);
router.route("/:id")
.get(wrapAsync(ListingController.GetId))
.put(isLoggedIn, isOwner,validatelisting, wrapAsync(ListingController.Update))
.delete( isLoggedIn,isOwner, wrapAsync(ListingController.Delete));
// ✅ Show form to create a new listing


// ✅ Edit listing form


module.exports = router;
