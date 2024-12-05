const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});
const Review = require("../models/review.js");


module.exports.index = async (req, res)=>{
 
    const allListings = await Listing.find({});
    res.render( "listings/index.ejs", {allListings});
  };

  module.exports.newFormRender =  (req, res)=>{
    res.render("listings/new.ejs");
  };

  module.exports.showListing = async (req, res)=>{
    let {id} =req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate:{path: "author",}}).populate("owner");
    if(!listing){
      req.flash("error", " Listing not found !");
      res.redirect("/listing");
    }
    res.render("listings/show.ejs", {listing});
  };

  module.exports.createNewListing = async (req, res, next)=>{
     let response = await geocodingClient
     .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
     })
     .send();
     console.log(response.body.features[0].geometry);
   

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created !");
    res.redirect("/listing");
  };

  module.exports.destroyListing = async (req, res)=>{
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listing");
  };

  module.exports.editFormRender =  async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", " Listing not found !");
      res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing , originalImageUrl});
  };

  module.exports.updateListing =  async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body; 
   
        const listing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });
        if(typeof req.file !== "undefined"){
          let url = req.file.path;
          let filename = req.file.filename;

          listing.image.url = url;
          listing.image.filename = filename;
          listing.save();
        }
        
        req.flash("success", "Listing Updated !");
        res.redirect(`/listing/${id}`);
   
  };

  module.exports.type = async (req, res) => {
    let { name } = req.params;
    console.log(name);
    let allListings = await Listing.find({ kind: { $eq: name } });
    res.render("./listings/index.ejs", { allListings });
}

 



