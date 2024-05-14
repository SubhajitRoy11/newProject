const express=require("express");
const app=express();
// const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const sessionoptions={
    secret:"mysupersecretstring",resave:false,saveUninitialized:true,
}

app.use(session(sessionoptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    req.flash("success","user registered successfully");
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:express.session.name});
})



// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }

//     res.send(`you sent a request ${req.session.count} times`);
// })

// app.get("/test",(req,res)=>{
//     res.send("test successful");
// });

// app.use(cookieParser("secretcode"));

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste",{signed:true});
//     res.send("server is working");
// });

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi, I am root!");
// })

app.listen(3000,()=>{
    console.log("The server is listen from port 3000");
})