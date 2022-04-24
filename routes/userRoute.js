const express =require('express')
const router=express.Router()
const UserModel=require('../model/userModel')
const {getShippingInfor,updateUserInfor, addOrders, getOrders} =require('../controllers/userController')
router.get('/shippingInfor',getShippingInfor)
router.post('/updateUserInfor',updateUserInfor)
router.post('/addOrders',addOrders)
router.get('/orders/:userId',getOrders)
module.exports=router