const express =require('express')
const router=express.Router()
const UserModel=require('../model/userModel')
const {createUser,getShippingInfor,updateShippingInfor} =require('../controllers/userController')
router.post('/createUser',createUser)
router.get('/shippingInfor',getShippingInfor)
router.post('/updateShippingInfor',updateShippingInfor)
module.exports=router