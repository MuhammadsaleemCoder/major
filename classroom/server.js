    const express=require("express")
    const app=express();
    // const users = require("./route/user.js")
    // const posts = require("./route/post.js")
    const session = require("express-session")
    const flash = require("connect-flash")

    app.use(session({secret:"mycode"}))
    app.use(flash());

    app.get("/test",(req,res)=>{
        res.send("Test is successfull")
    })



    app.listen(8080,()=>{
        console.log("Server is running")
    })

