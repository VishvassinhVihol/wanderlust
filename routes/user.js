const express = require("express")
const router = express.Router()
const User = require('../models/user.js')
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const { saveRedirectUrl } = require("../views/middleware.js")
const userController = require('../controller/user.js')
 
//day 50
router.get('/signup',userController.signupForm)

//to save user
router.post('/signup',wrapAsync(userController.signup))

//for login

router.get('/login',userController.loginForm)

router.post('/login',saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}), userController.loginCallbackforRedirectURL)

//day 51
//logout page
//user ne current session mathi delete karva or logout karva
router.get('/logout',userController.logout)
module.exports = router