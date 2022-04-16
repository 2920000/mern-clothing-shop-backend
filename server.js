const express = require('express')
const mongoose= require ('mongoose')
const cors=require('cors')
const bodyParser=require('body-parser')
const dotenv=require('dotenv')
const methodOverride=require('method-override')
const productRouter=require('./routes/productRoute')
const loginRouter=require('./routes/loginRoute')
const accountRouter=require('./routes/accountRoute')
const cartRouter=require('./routes/cartRoute')
const userRouter=require('./routes/userRoute')
const reviewsRouter=require('./routes/reviewsRoute')
dotenv.config()
const app =express()

app.set('view engine','ejs')
app.use(cors())
app.use(methodOverride('_method'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/products',productRouter)
// app.use('/login',loginRouter)
app.use('/account',accountRouter)
app.use('/cart',cartRouter)
app.use('/user',userRouter)
app.use('/reviews',reviewsRouter)


const PORT=process.env.PORT||5000

mongoose.connect(process.env.DATABASE_URL,()=>{
    console.log('Connected to mongodb')
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
})

