const ExpressError = require('../utils/ExpressError.js')
const {listingSchema} = require('../schema.js')
const {reviewSchema} = require('../schema.js')
const Listing = require("../models/listing.js")
const Review = require('../models/review.js')
//middleware to handle validation errors.part of joi
module.exports.validateListing = (req,res,next) => {
    if (req.file) {
        req.body.listing.image = {
            url: req.file.path, // Assuming you’re using Cloudinary, this will be the URL
            filename: req.file.filename
        };
    }
    let {error} = listingSchema.validate(req.body) ;
    if(error){
        let errMsg = error.details.map((el) => el.message()).join(",")
        throw new ExpressError(400,errMsg)
    }
    else{
        next()
    } 
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body) ;
    if(error){
        let errMsg = error.details.map((el) => el.message()).join(",")
        throw new ExpressError(400,errMsg)
    }
    else{
        next()
    } 
};

//day 51
//function to check if the user is loggedin or not before CRUD the listing

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //day 51 : now if we want ke jevo user login kare tevo j te te page par javo joie jene te access karva jai rahyo hato.so for that we will store req.originalUrl in req.session
        //originalUrl will store the original url we try to access
        req.session.redirectUrl =  req.originalUrl;
        req.flash('error','you must logged in to create new listing!')
        return res.redirect('/login')
    }
    return next()
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
        //if we try to access req.session.redirectUrl in login page directly to passport login ne authenticate karine session ne khali kari deshe tethi aapda jode tya undefined aavshe that why we have to store this in locals
    }
    return next()
}

//to check that currUser is Owner of current listing
module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params

    let list = await Listing.findById(id)
    if(!list.owner.equals(req.user._id)){
        req.flash('error','you are not owner of this list!')
        return res.redirect(`/listings/${id}`)
    }
    next()
}

//to chek that currUser is author of review
module.exports.isReviewAuthor = async(req,res,next) => {
    let {reviewId,id} = req.params

    let review = await Review.findById(reviewId)
    if(!review.author._id.equals(req.user._id)){
        req.flash('error','you are not owner of this review!')
        return res.redirect(`/listings/${id}`)
    }
    next()
}