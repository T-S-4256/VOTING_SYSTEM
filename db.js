const mongoose = require("mongoose");

require("dotenv").config();

const mongooseUrl = process.env.MONGOOSE_LOCAL_URL;

mongoose.connect(mongooseUrl);

const db = mongoose.connection;

db.on('connected', () => {
    console.log("DATABASE CONNECTED!");
})

db.on('disconnected', () => {
    console.log("DISCONNECTED");
})

db.on('error', (err) => {
    console.log("UNABLE TO CONNECT WITH DATABSE : ", err);
})

module.exports = db;