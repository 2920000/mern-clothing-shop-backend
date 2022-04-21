const express = require("express");
const { auth } = require("../middlewares/auth");
const router = express.Router();
const {
  createProduct,
  createProductForm,
  getAllProducts,
  products,
  updateProduct,
  deleteProduct,
  updateProductForm,
  getProductsByStattus,
  getProductsByTypeAndCategory,
  getProductBySearch,
  getProductByCollection,
  getProductBySlug,
  getProductByTags,
} = require("../controllers/productController");

router.get("/", products);
router.get("/search", getProductBySearch);
router.get("/createProduct", createProductForm);
router.get("/updateProductForm/:productId", updateProductForm);
router.get("/management", getAllProducts);
router.get("/tags/:productId", getProductByTags);
router.get("/:status", getProductsByStattus);
router.get("/collection/:collection", getProductByCollection);
router.get("/detail/:slug", getProductBySlug);
router.get("/:category/:type", getProductsByTypeAndCategory);
router.post("/", createProduct);
router.post("/update/:productId", updateProduct);
router.delete("/delete/:productId", deleteProduct);

module.exports = router;
