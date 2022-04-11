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

// trả về json
const products = async (req, res) => {
  try {
    const allProducts = await ProductModel.find();
    res.json(allProducts);
  } catch (error) {
    console.log(error.message);
  }
};

// lấy sản phẩm theo Id
const getProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const productById = await ProductModel.findById(productId);
    res.json(productById);
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
  const {
    title,
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
  } = req.body;
  const sub_imageArray = sub_image.split(",");
  const sizeArray = size.split(",");
  const collectionArray = collection.split(",");
  const savedProduct = await new ProductModel({
    title,
    price,
    description,
    category,
    sale,
    image,
    sub_image: sub_imageArray,
    sold,
    brand,
    origin,
    status,
    color,
    size: sizeArray,
    gender,
    type,
    belongs_to_collection: collectionArray,
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
  const {
    title,
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
  } = req.body;
  const sub_imageArray = sub_image.split(",");
  const sizeArray = size.split(",");
  try {
    await ProductModel.findByIdAndUpdate(productId, {
      title,
      price,
      description,
      category,
      sale,
      image,
      sub_image: sub_imageArray,
      sold,
      brand,
      origin,
      status,
      color,
      size: sizeArray,
      gender,
      type,
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
  console.log(productId);

  try {
    await ProductModel.findByIdAndDelete(productId);
    res.redirect("/products/management");
  } catch (error) {
    console.log(error.message);
  }
};

const getProductsByStattus = async (req, res) => {
  const status = req.params.status;
  try {
    const productsByStatus = await ProductModel.find({ status });
    const newProductsByStatus = productsByStatus.map((product) => ({
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
    }));
    res.json(newProductsByStatus);
  } catch (error) {}
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
    }));
    res.json(newProducts);
  } catch (error) {
    console.log(error.message);
  }
};
const getProductByCollection = async (req, res) => {
  const { collection } = req.params;
  const page = req.query.page;
  const sort = req.query.sort;
  let sortInMongodb = { arrive_time: -1 };
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
    //test - tiền trong khoảng
    //  let x=await ProductModel.find({
    //    price:{$gt:200000,$lt:400000}
    //  })
    //test

   
    let newProductsByQuery = productsByCollectionByQuery.map((product) => ({
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      brand: product.brand,
      sale: product.sale,
      subImage: product.sub_image[0],
      color: product.color,
    }));

    const priceQuery = req.query.pricess;
    if (priceQuery) {
      const priceArray = priceQuery.split(",");
      const firstPrice = Number(priceArray[0]);
      const secondPrice = Number(priceArray[1]);
      newProductsByQuery = newProductsByQuery.filter((product) => {
        if (firstPrice === 600000 && priceArray.length < 2) {
          return product.price < 600000;
        } else if (firstPrice === 1200000 && priceArray.length < 2) {
          return product.price > 1200000;
        } else {
          return product.price > firstPrice && product.price < secondPrice;
        }
      });
    }

    const brandData = [];
    const colourData = [];
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

    // phân trang
    let pageArray = [];
    const allProductsNumber = newProductsByQuery.length;
    for (let i = 0; i < allProductsNumber; i++) {
      if (i < page * 9 && i >= 9 * (page - 1)) {
        pageArray.push(newProductsByQuery[i]);
      }
    }

    res.json({ pageArray, total: allProductsNumber, brandData, colourData });
  } catch (error) {}
};
module.exports = {
  getAllProducts,
  getProductById,
  createProductForm,
  createProduct,
  products,
  updateProduct,
  deleteProduct,
  updateProductForm,
  getProductsByStattus,
  getProductsByTypeAndCategory,
  getProductBySearch,
  getProductByCollection,
};
