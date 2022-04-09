const express = require("express");
const router = express.Router();
const {
  addCartToDatabase,
  getCartToDatabase,
  removeCartProductFromDatabase,
  updateCartProductAmountFromDatabase,
  clearCart,
} = require("../controllers/cartController");

router.post("/add", addCartToDatabase);
router.get("/get/:userId", getCartToDatabase);
router.post("/remove", removeCartProductFromDatabase);
router.post("/update", updateCartProductAmountFromDatabase);
router.post("/clearCart", clearCart);

module.exports = router;
