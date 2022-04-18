const CartModel = require("../model/cartModel");
var mongoose = require("mongoose");
const updateProductQuantityInCart = async (
  productWantToUpdate,
  productData,
  userId
) => {
  return await CartModel.findOneAndUpdate(
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
        "cart.$.amount":
          productWantToUpdate.amount + Number(productData.amount),
      },
    },
    {
      new: true,
    }
  );
};
const addNewProductToCart = async (userId, cartProduct) => {
  return await CartModel.findByIdAndUpdate(
    {
      _id: userId,
    },
    {
      $push: { cart: cartProduct },
    },
    {
      new: true,
    }
  );
};

const addCartProductToDatabase = async (req, res) => {
  const { productData, userId } = req.body;
  const cartDataFromLocal = req.body.cartDataFromLocal;

  const compare = (cartProduct) => {
    return (product) => {
      return (
        product.productId === cartProduct.productId &&
        product.size === cartProduct.size
      );
    };
  };

  try {
    const cartExisting = await CartModel.findById(userId);
    const allProductsInCart = cartExisting.cart;

    const isCartExisting = Boolean(cartExisting);
    const isCartFromLocalExisting = Boolean(cartDataFromLocal);

    if (isCartExisting && !isCartFromLocalExisting) {
      const productWantToUpdate = allProductsInCart.find(compare(productData));
      if (!productWantToUpdate) {
        return res.json(await addNewProductToCart(userId, productData));
      }
      return res.json(
        await updateProductQuantityInCart(
          productWantToUpdate,
          productData,
          userId
        )
      );
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
      let cartProductsAfterUpdated = null;
      for (let localProduct of cartDataFromLocal) {
        const cartProductWantToUpdate = allProductsInCart.find(
          compare(localProduct)
        );
        if (!cartProductWantToUpdate) {
          cartProductsAfterUpdated = await addNewProductToCart(
            userId,
            localProduct
          );
        } else {
          cartProductsAfterUpdated = await updateProductQuantityInCart(
            cartProductWantToUpdate,
            localProduct,
            userId
          );
        }
      }
      res.status(200).json(cartProductsAfterUpdated);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const getCartFromDatabase = async (req, res) => {
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
  const cartProduct = req.body.payload.cartProduct;
  const action = req.body.payload.action;
  try {
    const response = await CartModel.findOneAndUpdate(
      {
        _id: userId,
        cart: {
          $elemMatch: {
            productId: cartProduct.productId,
            size: cartProduct.size,
          },
        },
      },
      {
        $set: {
          "cart.$.amount": (cartProduct.amount =
            action === "plus"
              ? cartProduct.amount + 1
              : cartProduct.amount - 1),
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(response);
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
  addCartProductToDatabase,
  getCartFromDatabase,
  removeCartProductFromDatabase,
  updateCartProductAmountFromDatabase,
  clearCart,
};
