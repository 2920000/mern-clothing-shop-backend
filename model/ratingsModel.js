const mongoose = require("mongoose");

const productRating = {
  _id: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  userInfor: {
    type: Object,
    require: true,
  },
  productRatingInfor: {
    type: Object,
    require: true,
  },
  starRating: {
    type: Number,
    require: true,
  },
  tagsRating: {
    type: Array,
  },
  commentText: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
};
const productRatingsSchema = mongoose.Schema({
  productId: {
    type: String,
    require: true,
  },
  productRatings: [productRating],
  slug: {
    type: String,
    require: true,
  }
});
const ProductRatingsModel = mongoose.model(
  "product_ratings",
  productRatingsSchema
);
module.exports = { productRating, ProductRatingsModel };
