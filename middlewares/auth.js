// const Users=require('../model/userModel')
// const auth=async(req,res,next)=>{
//     const {username,password}=req.body
//     console.log(req.body)
//   const existingUser= await Users.findOne({username})
    
//   if(existingUser){
//       if(password===existingUser.password&&existingUser.isAdmin===true){
//         next() 
//       }else{
//         res.status(400).send('Sai mật khẩu')
//       }
//   }
//   else{
//     res.redirect('/login')
//   }
// }

// module.exports={auth}