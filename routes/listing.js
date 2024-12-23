const express = require("express")
const router = express.Router()
const wrapAsync = require('../utils/wrapAsync.js')

const Listing = require("../models/listing.js")
const {isLoggedIn,validateListing,isOwner} = require('../views/middleware.js')//fucntion to check user is loggedin or not
const listingController = require('../controller/listing.js')
const multer  = require('multer')//form na data ne parse karva.

const {storage} = require('../cloudinaryConfig.js')

// const upload = multer({ dest: 'uploads/' })//je files aavse tene aa folder ma store karo
const upload = multer({ storage })//cloudinary na storage me store karvao

//all listing routes
//to show all data we will create /listings GET request
//index route
router.get("/",wrapAsync(listingController.index))

//to create new Post
//create route
router.get("/new",isLoggedIn,listingController.randerNewForm)
//now add
router.post("/",isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.addNewListing))


//read
//to show individual post
router.get("/:id",wrapAsync(listingController.showList))

//to edit and update list
router.get("/:id/edit",isOwner,isLoggedIn,wrapAsync(listingController.updateForm))

//now updation
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateList))

//to delete
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteList))

module.exports = router