const express = require("express");
const router = express.Router({mergeParams:true})
const Listing = require("../models/listing.js");
const wrapAsync = require("../uitil/wrapAsync.js");
const ExpressError = require("../uitil/expressError.js");
const {isloggedin, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudenaryStorage.js");
const upload = multer({ storage });
const Review = require("./Review.js");


router.route("/")
.get( wrapAsync(listingController.index))
.post(
  isloggedin,
  upload.single('listing[image]'),
  validateListing,
   wrapAsync(listingController.createNewListing)
);
  
  //new route
  router.get("/new",isloggedin,listingController.newFormRender);

  router.get("/search", async (req, res) => {
    try {
        const { key: parameter, country, title } = req.query;
        console.log("Received query parameters:", req.query);

        // Build the query object dynamically
        const query = {};

        // Add location filter (case-insensitive)
        if (parameter) {
            query.location = { $regex: parameter, $options: "i" };
        }
        if (country) {
            query.country = { $regex: country, $options: "i" };
        }
        
        if (title) {
          const escapedTitle = title.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"); // Escape special characters in the title for regex
          query.title = {title:{ $regex: escapedTitle, $options: "i" }};  // Case-insensitive regex search
      }

        console.log("Constructed query:", query);
        const listings = await Listing.find(query);

        console.log("Listings found:", listings);

        res.render("listings/search.ejs", { listings }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.route("/type/:name")
    .get(wrapAsync(listingController.type));


router.route("/:id")
.get( wrapAsync(listingController.showListing))
.delete(
  isloggedin,
  isOwner,
   wrapAsync(listingController.destroyListing))
.put(
    isloggedin,
    isOwner,
    upload.single('listing[image]'),
    listingController.updateListing
   ); 

  
  //edit route
  router.get("/:id/edit",
    isloggedin,
    isOwner,
    listingController.editFormRender);

    
  
  

  module.exports = router;