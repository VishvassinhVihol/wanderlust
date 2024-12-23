//joi : joi is a npm package which is used to validate our schema
//this is server side validation not mongoose side
const Joi = require('joi');
const review = require('./models/review');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required().min(0),
        image: Joi.object({
            url: Joi.string(),
            filename: Joi.string()
        }),
        
        price: Joi.number().required(),
    }).required()
})

//shema validation for review
const reviewSchema  = Joi.object({
    review: Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    }).required()
})

module.exports = {listingSchema,reviewSchema}