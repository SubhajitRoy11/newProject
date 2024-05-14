const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken  });


module.exports.index=async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
 };

 module.exports.renderNewForm =(req,res)=>{
    console.log(req.user);
     res.render("./listings/new.ejs")
 }

 module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
       path: "reviews",
       populate:{
           path:"author"
       }
    }).populate("owner");
    // .populate({
    //     path:"owner",
    //     select: "username"
    // });
    if(!listing){
       req.flash("error","Listing you requested for does not exist!");
       res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs",{listing});
}

module.exports.createListing=async(req,res,next)=>{
    
    req.body.listing.owner = req.user._id;
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
        
        // let url=req.file.path;
        // let filename=req.file.filename;
        // console.log(url,"..",filename);
    
    //let {title,description,image,price,country,location}=req.body;
    //let listing =req.body.listing;
        // if(!req.body.listing){
        //     throw new ExpressError(404,"Send valid data for listing");
        // }
        // let result=listingSchema.validate(req.body);
        // console.log(result);
        // if(result.err){
        //     throw new ExpressError(404,result.err);
        // }
        const newListing= new Listing(req.body.listing);
        // if(!newListing.title){
        //     throw new ExpressError(404,"Title is missing");
        // }
        // if(!newListing.description){
        //     throw new ExpressError(404,"description is missing");
        // }
        // if(!newListing.location){
        //     throw new ExpressError(404,"Location is missing");
        // }
        // newListing.owner=req.user._id;
        // newListing.image={url,filename};
        newListing.geometry=response.body.features[0].geometry;
        let saveListing=await newListing.save();
        console.log(saveListing);
        console.log("authenticate user",req.user);
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
        next();
    }




    module.exports.renderEditForm=async(req,res)=>{
        let {id}=req.params;
        const listing=await Listing.findById(id);
        if(!listing){
           req.flash("error","Listing you requested for does not exist!");
           res.redirect("/listings");
        }
        res.render("./listings/edit.ejs",{listing});
    }

    module.exports.updateListing=async(req,res)=>{
        // if(!req.body.listing){
        //     throw new ExpressError(404,"Send valid data for listing");
        // }
        let {id}=req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        req.flash("success","Listing Updated!");
        res.redirect(`/listings/${id}`);
    }

    module.exports.destroyListing=async(req,res)=>{
        let {id}=req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success","New Listing Deleted!");
        res.redirect("/listings");
    }