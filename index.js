const express = require("express")
const path = require("path")
const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const mongoose = require('mongoose')
const {checkForAuthenticationCookie} = require('./middlewares/authentication')
var cookieParser = require('cookie-parser')

const Blog = require('./models/blog')

mongoose.connect('mongodb://localhost:27017/blogify').then(console.log("Database connected!"))


const app = express()
const PORT = 8000

app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")));

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))


app.get('/', async (req, res)=>{
    const allBlogs = await Blog.find({}).sort({createdAt: -1})
    res.render('home', {
        user: req.user,
        blogs: allBlogs
    })
})
app.use('/user', userRouter)
app.use('/blog', blogRouter)


app.listen(PORT, ()=>console.log(`http://localhost:${PORT}`))