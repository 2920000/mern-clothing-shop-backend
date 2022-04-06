const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  category:{
    type: String,
    require: true,
  },
  type:{
    type:String,
    require:true,
  },
  image: {
    type: String,
    require: true,
  },
  sold: {
    type: Number,
    require: true,
  },
  origin: {
    type: String,
  },
  brand: {
    type: String,
  },
  status:{
    type:String,
    require:true
  },
  sub_image:{
    type:Array,
    require:true,
  },
  color:{
    type:String,
    require:true
  },
  size:{
    type:Array,
    require:true
  },
  gender:{
    type:String,
    require:true
  },
  sale:{
   type:Number,
   default:0
  },
  belongs_to_collection:{
   type:Array,
   require:true
  }
  ,
  arrive_time:{
    type:Date,
    default:new Date()
  }
});
module.exports = mongoose.model("Product", productSchema);
