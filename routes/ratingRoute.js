const express=require('express')
const router=express.Router()
const {getRatings,createRating}=require('../controllers/ratingController')
router.get('/:slug',getRatings)
router.post('/create',createRating)

module.exports=router