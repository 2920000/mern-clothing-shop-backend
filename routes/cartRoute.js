const express=require('express')
const router=express.Router()
const {addCartToDatabase,getCartToDatabase,removeCartProductFromDatabase,updateCartProductAmountFromDatabase} =require('../controllers/cartController')

router.post('/add',addCartToDatabase)
router.get('/get',getCartToDatabase)
router.post('/remove',removeCartProductFromDatabase)
router.post('/update',updateCartProductAmountFromDatabase)



module.exports=router