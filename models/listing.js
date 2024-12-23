//in this folder models we will create models(collections) and then we will export it
//this is listing model means title,description,price,country and all

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review.js')

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String
    },
    price:Number,
    location:String,
    country:String,

    //for reviews it would be 1 to many relation like < 100000
    reviews:[
        {
            type: Schema.ObjectId,
            ref:"Review"
        }
    ],

    //day 51 video 6: add owner of listing.now go to show page
    owner:{
        type: Schema.ObjectId,
        ref:'User'
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
})

//now when we delete our list we want ke aapda reviews pan delete thai jay to tena mate post middleware lakhishu
listingSchema.post("findOneAndDelete",async (listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing