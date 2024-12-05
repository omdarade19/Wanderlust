const mongoose = require('mongoose');
const Scheme = mongoose.Schema;
const Review = require("./Review.js");

let listingScheme = new Scheme({
    title: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Scheme.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Scheme.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, // Don't do { location: { type: String } }
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    kind: {
        type: String,
        enum: ["Trending", "Rooms", "Mountains", "castles", "Farms", "Arctic", "Amazing pools", "Iconic Cities"],
    }
});

//When Listing Delete Our Reviews also deleted middleWare
listingScheme.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingScheme);

module.exports = Listing;