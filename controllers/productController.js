const { removeVietnameseTones } = require("../helper/removeVietnameseTones");
const ProductModel = require("../model/productModel");

// lấy tất cả sản phẩm ra view
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await ProductModel.find();
    res.render("index", { products: allProducts });
  } catch (error) {
    console.log(error.message);
  }
};

const getAllProductsToClient = async (req, res) => {
  try {
    const allProducts = await ProductModel.find()
      .sort({ arrive_time: -1 })
      .limit(10);
    res.status(200).json(allProducts);
  } catch (error) {
    console.log(error.message);
  }
};
// trả về json
const products = async (req, res) => {
  try {
    const allProducts = await ProductModel.find();
    res.json(allProducts);
  } catch (error) {
    console.log(error.message);
  }
};

// lấy sản phẩm theo slug
const getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    const productBySlug = await ProductModel.findOne({ slug });
    res.json(productBySlug);
  } catch (error) {
    console.log(error.message);
  }
};
// trả về form tạo sản phẩm
const createProductForm = async (req, res) => {
  res.render("createProduct", { product: new ProductModel() });
};

// đưa dữ liệu vào mongodb
const createProduct = async (req, res) => {
  let {
    title,
    slug,
    price,
    description,
    category,
    sale,
    image,
    sub_image,
    sold,
    brand,
    origin,
    status,
    color,
    size,
    gender,
    type,
    collection,
    tags,
  } = req.body;

  sub_image = sub_image.split(",");
  size = size.split(",");
  collection = collection.split(",");
  tags = tags.split(",");

  const savedProduct = await new ProductModel({
    title,
    slug,
    price,
    description,
    category,
    sale,
    image,
    sub_image,
    sold,
    brand,
    origin,
    status,
    color,
    size,
    gender,
    type,
    belongs_to_collection: collection,
    tags,
  });
  try {
    savedProduct.save();
    res.redirect("/products/management");
  } catch (error) {
    console.log(error.message);
  }
};

//update sản phẩm
const updateProduct = async (req, res) => {
  const productId = req.params.productId;
  let {
    title,
    slug,
    price,
    description,
    category,
    sale,
    image,
    sub_image,
    sold,
    brand,
    origin,
    status,
    color,
    size,
    gender,
    type,
    tags,
  } = req.body;
  sub_image = sub_image.split(",");
  size = size.split(",");
  slug = slug.trim();
  tags = tags.split(",");
  try {
    await ProductModel.findByIdAndUpdate(productId, {
      title,
      slug,
      price,
      description,
      category,
      sale,
      image,
      sub_image,
      sold,
      brand,
      origin,
      status,
      color,
      size,
      gender,
      type,
      tags,
    });
    res.redirect("/products/management");
  } catch (error) {
    console.log(error.message);
  }
};

const updateProductForm = async (req, res) => {
  const productId = req.params.productId;
  const productById = await ProductModel.findById(productId);
  res.render("updateProduct", { product: productById });
};

// xóa sản phẩm theo Id
const deleteProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    await ProductModel.findByIdAndDelete(productId);
    res.redirect("/products/management");
  } catch (error) {
    console.log(error.message);
  }
};

const getProductsByTypeAndCategory = async (req, res) => {
  const category = req.params.category;
  const type = req.params.type;
  const productByTypeAndCategory = await ProductModel.find({ category, type });
  res.json(productByTypeAndCategory);
};

const getProductBySearch = async (req, res) => {
  const query = req.query.query;
  const convert = (str) => {
    const cutWhiteSpace = str.split(" ").join("");
    const newStr = cutWhiteSpace.toLowerCase().trim();
    return newStr;
  };
  try {
    if (query.length === 0) {
      res.json([]);
    }
    const allProducts = await ProductModel.find();
    const filterProducts = allProducts.filter(
      (product) =>
        removeVietnameseTones(convert(product.title)).includes(
          removeVietnameseTones(convert(query))
        ) ||
        removeVietnameseTones(convert(product.brand)).includes(
          removeVietnameseTones(convert(query))
        )
    );
    const newProducts = filterProducts.map((product) => ({
      _id: product._id,
      title: product.title,
      price: product.price,
      brand: product.brand,
      image: product.image,
      slug: product.slug,
    }));

    res.status(200).json(newProducts);
  } catch (error) {
    console.log(error.message);
  }
};

const getProductByCollection = async (req, res) => {
  const { collection } = req.params;
  const { page = 1, limit = 9, sort = "new-to-old" } = req.query;

  let sortInMongodb = { arrive_time: -1 };
  const priceRange = req.query.price && req.query.price.split(",");
  if (req.query.price) {
    req.query = req.query.price && {
      ...req.query,
      price: { $gt: priceRange[0], $lt: priceRange[1] },
    };
  }

  try {
    const productsByCollection = await ProductModel.find({
      belongs_to_collection: collection,
    });
    if (sort) {
      switch (sort) {
        case "asc-price":
          sortInMongodb = { price: 1 };
          break;
        case "desc-price":
          sortInMongodb = { price: -1 };
          break;
        case "best-selling":
          sortInMongodb = { sold: -1 };
          break;
        case "new-to-old":
          sortInMongodb = { arrive_time: -1 };
          break;
        default:
      }
    }

    let productsByCollectionByQuery;
    productsByCollectionByQuery = await ProductModel.find({
      belongs_to_collection: collection,
      ...req.query,
    }).sort(sortInMongodb);

    const productsLimit = await ProductModel.find({
      belongs_to_collection: collection,
      ...req.query,
    })
      .sort(sortInMongodb)
      .skip((page - 1) * limit)
      .limit(limit);

    const brandData = [];
    const colourData = [];
    const sizeData = ["L", "M", "S", "XL", "XXL", "XXXL"];
    const priceData = [
      "Dưới 600.000 đ",
      "600.000 đ - 1.200.000 đ",
      "1.200.000 đ - 3.000.000 đ",
    ];

    const allProductsLength = productsByCollection.length;
    for (let i = 0; i < allProductsLength; i++) {
      //
      if (colourData.length <= 0) {
        colourData.push({
          color: productsByCollection[i].color,
        });
      } else {
        const colorExisting = colourData.every(
          (e) => e.color !== productsByCollection[i].color
        );
        if (colorExisting) {
          colourData.push({
            color: productsByCollection[i].color,
          });
        }
      }
      if (brandData.length <= 0) {
        brandData.push({
          brand: productsByCollection[i].brand,
        });
      } else {
        const brandExisting = brandData.every(
          (e) => e.brand !== productsByCollection[i].brand
        );

        if (brandExisting) {
          brandData.push({
            brand: productsByCollection[i].brand,
          });
        }
      }
    }

    res.json({
      pageArray: productsLimit,
      total: productsByCollectionByQuery.length,
      brandData,
      colourData,
      sizeData,
      priceData,
    });
  } catch (error) {}
};

const getProductByTags = async (req, res) => {
  const productId = req.params.productId;
  const product = await ProductModel.findById(productId);
  const tags = product.tags;
  const matchedProducts = [];
  for (let tag of tags) {
    const productsByTags = await ProductModel.find({ tags: tag }).sort({
      arrive_time: -1,
    });
    if (productsByTags) {
      matchedProducts.push(...productsByTags);
    }
  }
  res.status(200).json(matchedProducts);
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  createProductForm,
  createProduct,
  products,
  updateProduct,
  deleteProduct,
  updateProductForm,
  getProductsByTypeAndCategory,
  getProductBySearch,
  getProductByCollection,
  getProductByTags,
  getAllProductsToClient,
};
