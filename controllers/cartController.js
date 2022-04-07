const CartModel = require("../model/cartModel");
var mongoose = require("mongoose");
const updateAmount = (productWantToUpdate, productData, userId) => {
  CartModel.updateOne(
    {
      _id: userId,
      cart: {
        $elemMatch: {
          productId: productData.productId,
          size: productData.size,
        },
      },
    },
    {
      $set: {
        "cart.$.amount": productWantToUpdate.amount + productData.amount,
      },
    },
    (err)=>{
      if(err) throw err
    }
  );
};
const addNewProduct = async (userId, productData) => {
  const saved = await CartModel.findByIdAndUpdate(
    {
      _id: userId,
    },
    {
      $push: { cart: productData },
    },
    {
      new: true,
    }
  );
  return saved.cart;
};
const addCartToDatabase = async (req, res) => {
  const { productData, userId, cartDataFromLocal } = req.body.payload;
  try {
    const cartExisting = await CartModel.findById(userId);
    const allProductsInCart = cartExisting?.cart;

    if (cartExisting && !cartDataFromLocal) {
      const productWantToUpdate = allProductsInCart?.find(
        (product) =>
          product.productId === productData.productId &&
          product.size === productData.size
      );
      const checkProductExisting = allProductsInCart.some(
        (product) =>
          product.productId === productData.productId &&
          product.size === productData.size
      );

      if (!checkProductExisting) {
        return res.json(await addNewProduct(userId, productData));
      }

      updateAmount(productWantToUpdate, productData, userId);
      return res.json('updated')
    }

    if ((!cartExisting && cartDataFromLocal) || !cartExisting) {
      const cartSaved = await CartModel({
        _id: userId,
        cart: cartDataFromLocal || [],
      });
      cartSaved.save();
      return;
    }
    if (cartDataFromLocal) {
      for(let localProduct of cartDataFromLocal){
        const checkProductExisting = allProductsInCart.some(
          (product) =>
            product.productId === localProduct.productId &&
            product.size === localProduct.size
        );
        const productWantToUpdate = allProductsInCart?.find(
          (productInCart) =>
            productInCart.productId === localProduct.productId &&
            productInCart.size === localProduct.size
        );

        if (!checkProductExisting) {
           res.json(await addNewProduct(userId, localProduct));
        }
        updateAmount(productWantToUpdate, localProduct, userId)
         res.status(200).json('updated')
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
const getCartToDatabase = async (req, res) => {
  const _id = mongoose.Types.ObjectId(req.params.userId);
  try {
    const productsCart = await CartModel.findById(_id);
    if(productsCart.cart.length===0) {
      return res.status(200).json(null);
    }
    res.status(200).json(productsCart.cart);
  } catch (error) {}
};

const removeCartProductFromDatabase = async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.body.payload.userId);
  const productId = req.body.payload.productId;
  try {
    const cartObject = await CartModel.findById(userId);
    CartModel.updateOne(
      {
        _id: userId,
      },
      {
        $pull: { cart: { _id: productId } },
      },
      (err, res) => {
        if (err) throw err;
      }
    );
  } catch (error) {}
};
const updateCartProductAmountFromDatabase = async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.body.payload.userId);
  const productId = req.body.payload.productId;
  const action = req.body.payload.action;
  try {
    const cartObject = await CartModel.findById(userId);
    const preProduct = cartObject.cart.find(
      (product) => product._id == productId
    );
    const preAmount = preProduct.amount;
    CartModel.updateOne(
      {
        _id: userId,
        "cart._id": productId,
      },
      {
        $set: {
          "cart.$.amount": action === "plus" ? preAmount + 1 : preAmount - 1,
        },
      },
      (err) => {
        if (err) throw err;
      }
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  addCartToDatabase,
  getCartToDatabase,
  removeCartProductFromDatabase,
  updateCartProductAmountFromDatabase,
};
