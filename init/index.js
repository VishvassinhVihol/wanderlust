//we will write here logic to initialize data
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js")

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
.then(res => console.log('connecting to mongoose'))
.catch(err => console.log(err));

const initDB = async () => {
    //first we will delete data which is alredy present in db
    await Listing.deleteMany({});

    //day 51 video 6 : to add owner in array
    initData.data = initData.data.map((obj) => ({...obj,owner:'673afd39332355d610b096aa'}))//map return new array.mara array na darek object ma object ni to propery aavshe but navo field owner pan aavshe
    await Listing.insertMany(initData.data);//initData is object.and the data is array of objects
    console.log('data is initialized');
    
}

initDB()