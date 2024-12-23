//in this we will make model for reviews
//day 47

const mongoose = require("mongoose");
const {Schema} = mongoose

// async function main() {
//     await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }
// main()
// .then(res => console.log('connecting to mongoose'))
// .catch(err => console.log(err));

const reviewSchema = new Schema({
    comment:String,
    rating: {
        type:Number,
        min:1,
        max:5
    },

    createdAt:{
        type:Date,
        default: Date.now()
    },

    //day 51 video 9 : add author in review.now go to show page
    author:{
        type: Schema.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model("Review",reviewSchema)
