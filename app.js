if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");
//const review = require("./models/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const {isLoggedIn}=require("./middleware.js")


const dbUrl=process.env.ATLASDB_URL;
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 36000,

})

store.on("error",()=>{
    console.log("error in mongo session store",err);
});

const sessionoptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};



app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error")
    // console.log(res.locals.success);
    res.locals.currUser = req.user;
    next();
})


app.get("/demoUser",async(req,res)=>{
    let fakeUser=new User({
        email:"student@email.com",
        username:"delta-student",
    });
    let registeredUser=await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));






main().then(()=>{console.log("Connected")}).catch((err)=>{console.log(err)});

async function main(){
    await mongoose.connect(dbUrl);
}



// app.get("/",(req,res)=>{
//     res.send("Working");
// });

// const validateListing=(req,res,next)=>{
//     let {error}=listingSchema.validate(req.body);
        
//         if(error){
//             let errmsg=error.details.map((el)=>el.message).join(",");
//             throw new ExpressError(404,errmsg);
//         }else{
//             next();
//         }
// }



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// app.get("/testListing",async(req,res)=>{
//     const sampleListing=new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"India"
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successfull Testing");
// })


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=505,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
})

// Middleware to check if user is authenticated
app.use((req, res, next) => {
    console.log("Authenticated User:", req.user);
    next();
});


app.listen(8080,()=>{
    console.log("Server is working");
})