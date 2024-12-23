//MVC:model,view,controller. MVC is design pattern used to manage code.in model we store db models.in view we store frontend and in controller we will store call back Functions
//in this listing.js we will store call back fns of listings
const Listing = require('../models/listing.js')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
let mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
}

module.exports.randerNewForm = (req,res) => {
    //we will render a form

    //day 51 - as of now anyone can create new listing.but we want ke jene login karel hoy te j new listing create kari shake
    //to aana mate passport aapdne req.isAuthenticate() nam no function puro pade chhe aa curr session ma user logged in chhe ke nahi te check kari aapshe

  
    res.render("listings/new.ejs");
}

module.exports.addNewListing = async (req,res,next) => {
    //let {title,description,price,location,country} = req.body;//old method
    //new method
    // const listing = req.body.listing
    // const newList = new Listing(listing)
    // await newList.save()
    // // console.log(listing);
    // res.redirect('/listings')

    //handling errors
    // try{
    //     const listing = req.body.listing
    //     const newList = new Listing(listing)
    //     await newList.save()
    //     // console.log(listing);
    //     res.redirect('/listings')
    // }
    // catch(err){
    //     next(err)
    // }

    // if(!req.body.listing){
    //     throw new ExpressError(400,'send valid data for listing')//400=bad request
    // }
    
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      }).send()
   
    
    
    //day 52 : adding image in cloudinary
    let url = req.file.path;
    let filename = req.file.filename;



    const listing = req.body.listing
    const newList = new Listing(listing)
    //day 51 video 6 : to add owner
    newList.owner = req.user._id
    newList.image = {url,filename}
    newList.geometry = response.body.features[0].geometry;
    //for flash message
    await newList.save()
    
    
  
    
    req.flash('success','New List Created!')
    // console.log(listing);
    res.redirect('/listings')
}

module.exports.showList = async (req,res) => {
   
    
    let {id} = req.params;
    const indList = await Listing.findById(id).populate({path:"reviews",populate:({path:"author",})}).populate('owner').populate('geometry');
    
    //if we serach for list that does not exist in that case we want to show a flash messege
    if(!indList){
        req.flash("error",'Listing you requested for does not exist!')
        res.redirect('/listings')
    }
    res.render("listings/show.ejs",{indList});
}

module.exports.updateForm = async (req,res) => {
    //we will render form
    let {id} = req.params;
    let list = await Listing.findById(id);

    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace('/upload','/upload/w_250')
    if(!list){
        req.flash("error",'Listing you requested for does not exist!')
        res.redirect('/listings')
    }
    
    res.render("listings/edit.ejs",{list,originalImageUrl});
}

module.exports.updateList = async (req,res) => {
    //pahela validateListing middleware function call thase for validation
    // if(!req.body.listing){
    //     throw new ExpressError(400,'send valid data for listing')//400=bad request
    // }

    //day 51 video 8 : now we want ke je aa listing no owner chhe te j aane edit kari shake.so we will create middleware for this in middleware.js

    let {id} = req.params

    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})

    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename}
        await listing.save()

    }

    req.flash('success','List Updated!')
    res.redirect(`/listings/${id}`)
}

module.exports.deleteList = async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success','List Deleted!')
    res.redirect('/listings')
}