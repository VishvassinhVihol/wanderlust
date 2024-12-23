//call back for reviews
const Listing = require("../models/listing.js")
const Review = require('../models/review.js')

module.exports.createReview = async (req,res) => {
    let listing = await Listing.findById(req.params.id)
    let review = new Review(req.body.review)
    review.author = req.user._id
    console.log(review);
    

    listing.reviews.push(review)
    req.flash('success','New Review Created!')
    await review.save()
    await listing.save()
    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview = async (req,res) => {
    let {id,reviewId} = req.params

    //pull operator in mongoose
    //pull operator removes from an existing array all instances of a value or values that a match a specified condition
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Review Deleted!')

    res.redirect(`/listings/${id}`)
}