const express=require('express')
const router=express.Router()
const {getReviews,createReview}=require('../controllers/reviewsController')
router.get('/:productId',getReviews)
router.post('/create',createReview)

module.exports=router