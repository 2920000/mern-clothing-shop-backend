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
    (err) => {
      if (err) throw err;
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

  const compare = (product) => {
    return (
      product.productId === productData.productId &&
      product.size === productData.size
    );
  };
  const checkExisting = (params) => {
    return params.some(compare);
  };
  const findProduct = (params) => {
    return params.find(compare);
  };

  try {
    const cartExisting = await CartModel.findById(userId);
    const allProductsInCart = cartExisting?.cart;

    const isCartExisting = Boolean(cartExisting);
    const isCartFromLocalExisting = Boolean(cartDataFromLocal);
   
    const productWantToUpdate = findProduct(allProductsInCart);
    const isProductExisting = checkExisting(allProductsInCart);

    if (isCartExisting && !isCartFromLocalExisting) {
      if (!isProductExisting) {
        return res.json(await addNewProduct(userId, productData));
      }
      updateAmount(productWantToUpdate, productData, userId);
      return res.json("updated");
    }

    if (!isCartExisting) {
      const savedCart = await CartModel({
        _id: userId,
        cart: cartDataFromLocal || [productData],
      });
      savedCart.save();
      return res.status(200).json(savedCart);
    }

    if (isCartFromLocalExisting) {
      for (let localProduct of cartDataFromLocal) {
        if (!isProductExisting) {
          res.json(await addNewProduct(userId, localProduct));
          continue;
        }
        updateAmount(productWantToUpdate, localProduct, userId);
        res.status(200).json("updated");
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
    if (productsCart.cart.length === 0) {
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

const clearCart = async (req, res) => {
  const userId = req.body.userId;
  CartModel.updateOne(
    {
      _id: userId,
    },
    {
      $set: { cart: [] },
    },
    (err) => {
      if (err) throw err;
    }
  );
  res.status(200).json("cleared");
};
module.exports = {
  addCartToDatabase,
  getCartToDatabase,
  removeCartProductFromDatabase,
  updateCartProductAmountFromDatabase,
  clearCart,
};
