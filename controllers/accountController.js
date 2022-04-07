const AccountModel = require("../model/accountModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const login =async (req, res) => {
  const {email,password}=req.body.data
  try {
      const user= await AccountModel.findOne({email})
    //   const isEmailExisting= await AccountModel.findOne({email})
      if(!user) return res.status(400).json({email:"Email không tồn tại"})
      const comparePassword= await bcrypt.compare(password,user.password)
      if(!comparePassword) return res.status(400).json({password:"Mật khẩu không chính xác"})
      const accessToken = jwt.sign({ username:user.username, email }, process.env.TOKEN_SECRET,{expiresIn:'30s'});
    res.status(200).json({login:'success',_id:user._id,username:user.username,email,accessToken})
   } catch (error) {
      
  }
};
const register = async (req, res) => {
  const { username, email, password } = req.body.data;
  try {
    const isEmailExisting = await AccountModel.findOne({ email });
    console.log(isEmailExisting)
    if (isEmailExisting) return res.status(400).json({email:"Email đã tồn tại"});
    const passwordBcrypt = await bcrypt.hash(password, 10);
    const accessToken = jwt.sign({ username, email }, process.env.TOKEN_SECRET);
    const accountSaved= await AccountModel({
        username,
        email,
        password:passwordBcrypt
    })
    accountSaved.save()
    res.status(200).json({_id:accountSaved._id,register:'success',username,email,accessToken})
  } catch (error) {
      console.log(error.message)
  }
};


module.exports = { login, register };
