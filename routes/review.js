const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync.js')

const Listing = require("../models/listing.js")

const Review = require('../models/review.js')
let {validateReview, isLoggedIn, isReviewAuthor} = require('../views/middleware.js')
const reviewController = require("../controller/review.js")



//for inserting review
router.post("/",isLoggedIn/*koi hopscotch thi req mokline withou login review create na kari de te mate */,validateReview,wrapAsync(reviewController.createReview))

//delete review route
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports = router