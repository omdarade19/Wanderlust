const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    created_at: {
        type: Date,
        default: Date.now, // Correct function reference
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// Check if the model already exists to avoid OverwriteModelError
// module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
