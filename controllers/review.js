const Review = require("../models/review.js"); // Adjust the path as necessary
const Listing = require("../models/listing.js");

module.exports.postReview =  async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body.review;
  
    if (!rating || !comment) {
      return res.status(400).send("Rating and comment are required.");
    }
  
    const listing = await Listing.findById(id);
    const newReview = new Review({ rating: rating, comment });
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New REview Created !");
  
    res.redirect(`/listing/${listing._id}`);
  };

  module.exports.destroyReview = async(req, res)=>{
    const {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
     console.log(`redirecting path /listing/${id}`);
     req.flash("success", "Review Deleted !");
    res.redirect(`/listing/${id}`);
   
  };