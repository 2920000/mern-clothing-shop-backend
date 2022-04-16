const { default: mongoose } = require("mongoose");
const Mongoose = require("mongoose");
const {reviewSchema}=require('./reviewsModel')
const orderSchema = mongoose.Schema({
  productId: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  sale: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Number,
    require: true,
    default: 1,
  },
  size: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
const inforSchema = Mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
  },
  dayOfBirth: {
    type: String,
  },
  phone: {
    type: Number,
  },
});
const shipping_infor = Mongoose.Schema({
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  address: {
    type: String,
  },
});
const productsReviewed = Mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  review:reviewSchema
});
const userSchema = Mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  infor: inforSchema,
  orders: [orderSchema],
  shipping_infor: shipping_infor,
  productsReviewed: [productsReviewed],
});

module.exports = Mongoose.model("users", userSchema);
