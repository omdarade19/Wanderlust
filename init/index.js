const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData= require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj)=>({...obj, owner: "674041bec7b19073dc41b3b5"}))
        await Listing.insertMany(initData.data);
        console.log("Data initialized");
    } catch (error) {
        console.error("Error initializing data:", error);
    }
};

initDB();
