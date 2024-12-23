require('dotenv').config()//dotenv is an npm package used to read info from .env files
console.log(process.env.SECRET);//to print info of .env file

//connect mongo for session storage
const MongoStore = require('connect-mongo');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require('./utils/ExpressError.js')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')

//for express.router() we create new file to handle routes
const listingRouter = require("./routes/listing.js")
const reviewRouter = require('./routes/review.js')
const userRouter = require('./routes/user.js')
const dburl = process.env.ATLASDB_URL

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

const store = MongoStore.create({
    mongoUrl: dburl,//aa db ni andar session info store thase
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter:24*3600//aatla samay bad mari session info update thay 
})
store.on('error',() => {
    console.log('error in mongo session store',err);
    
})
app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,

    //cookie option
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:Date.now()+7*24*60*60*1000,//this is epxiry date of cookie.aajni tarikh thi laine 7 days pachhi aa cookie browser mathi delete thai jase.by default jya sudhi browser bandh na thay tya sudhini hoy chhe
    }
}))
app.use(flash())


//for passport(authentication and authorization day 50)
//we need session to implement passport
app.use(passport.initialize())//middleware to initialize passport
app.use(passport.session())//It allows Passport to store user authentication details (e.g., user ID) in a session, so the user's logged-in state can persist across multiple requests.To maintain a logged-in user's session. For example, if a user logs in, they don't need to re-authenticate for every request during the same session.
passport.use(new LocalStrategy(User.authenticate()))//user ne authenticate karva LocalStrategy no upyog karo.User.authenticate() is a method provided by passport-local-mongoose. It handles verifying user credentials (username and hashed password).
passport.serializeUser(User.serializeUser());//to store session data.User.serializeUser() is a method provided by passport-local-mongoose. It tells Passport to store the user ID in the session.
passport.deserializeUser(User.deserializeUser());//User.deserializeUser() is a method provided by passport-local-mongoose. It fetches the full user details from the database using the user ID stored in the session.

let port = 8080;

app.listen(port,(req,res) => {
    console.log('server is running on port 8080');
    
})

//connect mongoose
async function main() {
    await mongoose.connect(dburl);
}
main()
.then(res => console.log('connecting to mongoose'))
.catch(err => console.log(err));

// app.get('/',(req,res) => {
//     res.send("all set")
    
// })

//day 50 - user Demo
app.get('/demouser',async(req,res) => {
    let fakeUser = new User({
        email:'vish@gmail.com',
        username:'vishu'
    })

    let registeredUser = await User.register(fakeUser,"user123");//User,password
    res.send(registeredUser)
})


//to test listing
app.get('/testlisting',async (req,res) => {
    let simpleListing = new Listing({
        title:'my new villa',
        description:'buy the mountain',
        price:1200,
        location:'toranto',
        country:'new zeland'
    })

    // await simpleListing.save()
    console.log('sample was saved');
    res.send('successful')
})

//for flash messages
app.use((req,res,next) => {
    res.locals.success = req.flash('success')
    //for err
    res.locals.error = req.flash('error')
    //day 51
    res.locals.currUser = req.user;
    next()
})

app.use('/listings',listingRouter)
//jyare aapde reviews ne add karva jaisu to error aavse kemke id undefined aavshe review.js file ma. kemke aa id ahi j app.js ma rahi jay chhe and teni aagadna params review vadi file ma jay chhe to aanu solution mergeParmas chhe go to review file
app.use('/listings/:id/reviews',reviewRouter)
app.use('/',userRouter)

//now if user send req to the route that does not exist then we want to send error which contain status code and message so
app.all('*',(req,res,next) => {
    //app.all('*') means aa tyare j execute thase jyare uprno koi path match nahi thay and * means all path
    next(new ExpressError(404,'page not found!'))
})

//for error handling
app.use((err,req,res,next) => {
    // res.send('something went wrong')
    let {status=500,message} = err;
    // res.status(status).send(message)
    res.status(status).render('error.ejs',{message})
})