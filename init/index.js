const mongoose=require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
let MONGO_URL= 'mongodb://127.0.0.1:27017/Wanderlust';
main()
.then(()=>{console.log("Yes its working")}).catch((err)=>{console.log("Some Error")})
async function main(){
    await mongoose.connect(MONGO_URL);
}





const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data)
    console.log("Data was init")
}
initDB();