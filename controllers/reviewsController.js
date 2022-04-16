const { default: mongoose } = require("mongoose");
const {ReviewsModel} = require("../model/reviewsModel");
const UserModel = require("../model/userModel");
const getReviews = async (req, res) => {
  const productId = req.params.productId;
  try {
    const reviewsInfor = await ReviewsModel.findOne({ productId });
    res.status(200).json([...reviewsInfor.reviews]);
  } catch (error) {
    console.log(error);
  }
};
const createReview = async (req, res) => {
  const reviewData = req.body.reviewData;
  const userInfor = reviewData.userInfor;
  const productInfor = reviewData.review.productInfor;
  const productId = reviewData.review.productInfor.productId;
  try {
    const reviewsInfor = await ReviewsModel.findOne({ productId });
    UserModel.updateOne(
      {
        _id: userInfor._id,
      },
      {
        $push: {
          productsReviewed: {
            _id: mongoose.Types.ObjectId(productInfor._id),
            review: {
              userInfor: userInfor,
              ...reviewData.review,
              availableReviews: reviewData.review.selectedAvailableReviews,
            },
          },
        },
      },
      (err) => {
        if (err) throw (err);
      }
    );
    if (reviewsInfor) {
      ReviewsModel.updateOne(
        {
          productId,
        },
        {
          $push: {
            reviews: {
              userInfor: userInfor,
              ...reviewData.review,
              availableReviews: reviewData.review.selectedAvailableReviews,
            },
          },
        },
        (err) => {
          if (err) throw err;
        }
      );
    } else {
      const savedReview = await ReviewsModel({
        productId,
        reviews: [
          {
            userInfor: userInfor,
            ...reviewData.review,
            availableReviews: reviewData.review.selectedAvailableReviews,
          },
        ],
      });
      savedReview.save();
    }
    res.status(200).json({ reviewed: true });
  } catch (error) {}
};
module.exports = { getReviews, createReview };
