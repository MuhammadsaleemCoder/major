const express=require("express")
        const app=express();
        const mongoose=require("mongoose")
        const Listing=require("./models/listing.js")
        const path=require("path");
        const methodOverride = require('method-override')
        const ejs_mate=require("ejs-mate");
        const wrapAsync=require("./utiles/wrapAsync.js")
        const ExpressError=require("./utiles/ExpressError.js")
        const {listingschema,reviewSchema}=require("./schema.js")
        const Review=require("./models/review.js");
        const route = require("./route/listing.js")
        const reviews = require("./route/review.js")
        // const { copyFileSync } = require("fs");


        app.set("view engine","ejs")
        app.set("views",path.join(__dirname,"views"))
        app.use(express.urlencoded({extended:true}))
        app.use(methodOverride('_method'))
        app.engine("ejs",ejs_mate)
        app.use(express.static(path.join(__dirname,"/public")))


        let MONGO_URL= 'mongodb://127.0.0.1:27017/Wanderlust';

        main()
        .then(()=>{console.log("Yes its working")}).catch((err)=>{console.log("Some Error")})
        async function main(){
            await mongoose.connect(MONGO_URL);
        }

        app.get("/",(req,res)=>{
            res.send("data")
        })



     app.use("/listing",route)
     app.use("/listing/:id/reviews",reviews)







        app.all(/.*/, (req, res, next) => {
            next(new ExpressError(404,"Page Not Found"));
        });

        app.use((err,req, res, next) => {
            const { statusCode=500,message="something"} = err;
            res.status(statusCode).render("error.ejs",{message})
            // res.status(statusCode).send(message);
        });



        app.listen(3000,()=>{
            console.log(`3000 is listening`)
        })