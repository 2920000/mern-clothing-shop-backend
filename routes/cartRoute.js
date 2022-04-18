const express = require("express");
const router = express.Router();
const {
  addCartProductToDatabase,
  getCartFromDatabase,
  removeCartProductFromDatabase,
  updateCartProductAmountFromDatabase,
  clearCart,
} = require("../controllers/cartController");

router.post("/add", addCartProductToDatabase);
router.get("/get/:userId", getCartFromDatabase);
router.post("/remove", removeCartProductFromDatabase);
router.post("/update", updateCartProductAmountFromDatabase);
router.post("/clearCart", clearCart);

module.exports = router;
