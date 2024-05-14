const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


main().then(()=>{console.log("Connected")}).catch((err)=>{console.log(err)});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
};


const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"661f16c9e5d3bbe958297e1f"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initilized");
};

initDB();