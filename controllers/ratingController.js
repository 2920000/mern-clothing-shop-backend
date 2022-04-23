const { default: mongoose } = require("mongoose");
const { ProductRatingsModel } = require("../model/ratingsModel");
const UserModel = require("../model/userModel");
const getRatings = async (req, res) => {
  const slug = req.params.slug;
  try {
    const productRatingsInfor = await ProductRatingsModel.findOne({
      slug,
    }).sort({created_at:1})
    res.status(200).json([...productRatingsInfor?.productRatings]);
  } catch (error) {
    console.log(error);
  }
};
const createRating = async (req, res) => {
  const ratingData = req.body.ratingData;
  const userInfor = ratingData.userInfor;
  const _id = ratingData.rating.productRatingInfor._id;
  const slug=ratingData.rating.productRatingInfor.slug
  const productId = ratingData.rating.productRatingInfor.productId;
  try {
    const productRatingsInfor = await ProductRatingsModel.findOne({
      productId,
    });

    UserModel.updateOne(
      {
        _id: userInfor._id,
      },
      {
        $push: {
          productRatings: {
            _id,
            userInfor,
            ...ratingData.rating,
          },
        },
      },
      (err) => {
        if (err) throw err;
      }
    );
    if (productRatingsInfor) {
      ProductRatingsModel.updateOne(
        {
          productId,
        },
        {
          $push: {
            productRatings: {
              _id,
              userInfor,
              ...ratingData.rating,
            },
          },
        },
        (err) => {
          if (err) throw err;
        }
      );
    } else {
      const savedRatings = await ProductRatingsModel({
        productId,
        slug,
        productRatings: [
          {
            _id,
            userInfor,
            ...ratingData.rating,
          },
        ],
      });
      savedRatings.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {}
};
module.exports = { getRatings, createRating };
