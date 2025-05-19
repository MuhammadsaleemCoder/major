const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/Wanderlust';

// Connect to MongoDB
main()
  .then(() => {
    console.log("Yes, it's working");
    initDB();  // Initialize the database once connected
  })
  .catch((err) => {
    console.log("Some Error", err);
  });

// Connect to the database
async function main() {
  await mongoose.connect(MONGO_URL);
}

// Initialize the database by inserting listings
const initDB = async () => {
  try {
    // Clear the listings collection before inserting new data
    await Listing.deleteMany({});

    // Convert the owner's string ID to a valid ObjectId
    const ownerId = new mongoose.Types.ObjectId('68218ee9b47e88d3213224e7');

    // Add the owner field to each listing in the data
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: ownerId,  // Ensure each listing has an 'owner' field set to the correct ObjectId
    }));

    // Insert all listings into the database
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (err) {
    console.log("Error initializing the database:", err);
  }
};
