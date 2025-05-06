const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review.js")

//all data we need
const ListingSchema = new Schema({
title:{
    type:String,
    require:true,
},
description: String,
image:{
        type:String,
        set:(v)=>v ===""? "https://i.pinimg.com/736x/86/28/44/8628446445eb6c971d1546b3eadb33f4.jpg" : v,
} ,
price:Number,
location: String,
country: String,
reviews:[
    {
        type:Schema.Types.ObjectId,
        ref:"Review",
    },
]

});
ListingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await review.deleteMany({id : {$in: listing.reviews}})
    }

})

const Listing = mongoose.model("Listing" , ListingSchema);
module.exports=Listing;