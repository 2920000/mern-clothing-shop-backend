const UserModel=require('../model/userModel')

const createUser=async(req,res)=>{
    const {userId,username}=req.body.payload
   try {
     await UserModel({
         _id:userId,
         infor:{
             username
         },
         orders:[],
         shipping_infor:{}
     }).save()
   } catch (error) {
       console.log(error)
   }
}

const getShippingInfor=async(req,res)=>{
  const userId=req.query.userId
  const userInfor= await UserModel.findById(userId)
  res.json(userInfor.shipping_infor)
}
const updateShippingInfor=async(req,res)=>{
    const {userId,fullName,phoneNumber,address}=req.body.payload
    const shippingInforUpdated=await UserModel.findByIdAndUpdate(
        {_id:userId},
        {
            shipping_infor:{
                fullName,
                phoneNumber,
                address
            }
        },
        {new:true}
    )
    res.json(shippingInforUpdated)
}
module.exports={createUser,getShippingInfor,updateShippingInfor}