const mongoose = require("mongoose");

const cartProductSchema = mongoose.Schema({
  productId: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  slug: {
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
});
const cartSkema = mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  cart: [cartProductSchema],
});

module.exports = mongoose.model("carts", cartSkema);
