const express=require("express")
const router=express.Router();


//Index
router.get("/users",(req,res)=>{
    res.send("Get a post")
})
//Index
router.get("/users/:id",(req,res)=>{
    res.send("Get a ID")
})
//post
router.post("/users",(req,res)=>{
    res.send("Get a post")
})
//Delete
router.delete("/users/:id",(req,res)=>{
    res.send("Get a post")
});

module.exports = router;