//callback for user model
const User = require('../models/user.js')

module.exports.signupForm = (req,res) => {
    res.render('users/signup.ejs')
}

module.exports.signup = async(req,res) => {
   try{
        let {username,email,password} = req.body;
        let newUser = new User({username,email,password})
        const registeredUser = await User.register(newUser,password)
        console.log(registeredUser);

        //day 51 
        //now jeva aapde signup karie to aapde evi functionality provide karvi chhe ke automatic j login thai jay so for that we have login method provide by passport.passport will automaticaly login current session user when he/she signup now go to middleware.js
        req.login(newUser,(err) => {//it will take two arg one is which user and second is callback
            if(err){
                return next(err)
            }
            req.flash('success','Welcome To WanderLust')
            res.redirect('/listings')
        })
       
   }
   catch(e){
       
        req.flash("error", e.message);
        res.redirect('/signup')
    }
    
}

module.exports.loginForm = (req,res) => {
    res.render('users/login.ejs')
}

module.exports.loginCallbackforRedirectURL = (req,res) =>{
    req.flash('success','Welcome back to WanderLust!')
    res.redirect(res.locals.redirectUrl || '/listings') //now when we try to login directly from our main page to isLoggedIn method call thashe j nahi and originalUrl ni val req.session ma sotre nahi thay and thethi locals ma pan store nahi thay to undefined aavshe val and page not found error aavshe to tethi bachava mate || '/listings'.next go to models listing
}

module.exports.logout = (req,res,next) => {
    //passport provide us a logout function to logout
    req.logOut((err) => {
        if(err){
            //logout function take call back function and return an error if any
            return next(err);
        }
        else{
            req.flash('success','you are logged out!')
            res.redirect('/listings')
        }
    })
}