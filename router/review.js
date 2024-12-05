const express = require("express");
const router = express.Router({mergeParams:true})
const wrapAsync = require("../uitil/wrapAsync.js");
const ExpressError = require("../uitil/expressError.js");
const Review = require("../models/review.js"); // Adjust the path as necessary
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema} = require("../Schema.js");
const {validateReview, isloggedin, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//reviews post route
router.post("/",
  isloggedin,
  reviewController.postReview);
  
  
  //review delete route
  router.delete("/:reviewId",
    isReviewAuthor,
     wrapAsync(reviewController.destroyReview))



  module.exports = router;