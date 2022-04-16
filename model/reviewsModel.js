const mongoose = require("mongoose");

 const reviewSchema = {
  userInfor:{
    type:Object,
    require:true
  },
  productInfor: {
    type: Object,
    require: true,
  },
  reviewStar: {
    type: Number,
    require: true,
  },
  availableReviews: {
    type: Array,
  },
  reviewText: {
    type: String,
  },
  created_at:{
    type:Date,
    default:Date.now()
  }
};
const reviewsSchema = mongoose.Schema({
  productId: {
    type: String,
    require: true,
  },
  reviews: [reviewSchema],
});
const ReviewsModel=mongoose.model("reviews", reviewsSchema)
module.exports ={ReviewsModel,reviewSchema};
