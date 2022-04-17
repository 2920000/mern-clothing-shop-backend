const { updateOne, findByIdAndUpdate } = require("../model/userModel");
const UserModel = require("../model/userModel");

const createUser = async (req, res) => {
  const { userId, username } = req.body.payload;
  try {
    await UserModel({
      _id: userId,
      infor: {
        username,
      },
      orders: [],
      shipping_infor: {},
      productsReviewd: [],
    }).save();
  } catch (error) {
    console.log(error);
  }
};

const getShippingInfor = async (req, res) => {
  const userId = req.query.userId;
  const userInfor = await UserModel.findById(userId);
  res.json(userInfor.shipping_infor);
};
const updateShippingInfor = async (req, res) => {
  const { userId, fullName, phoneNumber, address } = req.body.payload;
  const shippingInforUpdated = await UserModel.findByIdAndUpdate(
    { _id: userId },
    {
      shipping_infor: {
        fullName,
        phoneNumber,
        address,
      },
    },
    { new: true }
  );
  res.status(200).json(shippingInforUpdated);
};
const addOrders = async (req, res) => {
  const { orders, userId } = req.body.payload;
  try {
    UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $push: { orders: { $each: orders } },
      },
      (err) => {
        if (err) throw err;
      }
    );
    res.status(200).json("ordered");
  } catch (error) {
    console.log(error);
  }
};
const getOrders = async (req, res) => {
  const { userId } = req.params;
  const user = await UserModel.findById(userId);
  const orders = user.orders;
  const productRatings= user.productRatings;
  res.status(200).json({ orders, productRatings });
};
module.exports = {
  createUser,
  getShippingInfor,
  updateShippingInfor,
  addOrders,
  getOrders,
};
