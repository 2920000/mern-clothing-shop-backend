const UserModel = require("../model/userModel");

const getShippingInfor = async (req, res) => {
  const userId = req.query.userId;
  const userInfor = await UserModel.findById(userId);
  try {
    res.status(200).json(userInfor.shipping_infor);
  } catch (error) {
    res.status(400).json("null");
  }
};
const updateUserInfor = async (req, res) => {
  const { userId, username, fullName, phoneNumber, address } = req.body.payload;
  try {
    const updatedUserInfor = await UserModel({
      _id: userId,
      infor: {
        username,
      },
      orders: [],
      shipping_infor: {
        fullName,
        phoneNumber,
        address,
      },
      productsReviewd: [],
    });
    updatedUserInfor.save();
    res.status(200).json(updatedUserInfor.shipping_infor);
  } catch (error) {
    res.status(400).json(error);
  }
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
    res.status(400).json("not success");
  }
};
const getOrders = async (req, res) => {
  const { userId } = req.params;
  const newOrders = [];
  const user = await UserModel.findById(userId);
  try {
    const orders = user.orders;
    orders.forEach((order) => {
      newOrders.unshift(order);
    });
    const productRatings = user.productRatings;
    res.status(200).json({ orders: newOrders, productRatings });
  } catch (error) {
    res.status(400).json("error");
  }
};
module.exports = {
  getShippingInfor,
  updateUserInfor,
  addOrders,
  getOrders,
};
