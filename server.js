const express = require("express");
const app = express();

//CONFIGURING .ENV FILE
require("dotenv").config();
//IMPORTING PASSPORT FROM AUTH.JS
const passport = require("./auth");
//IMPORTING DB FROM DB.JS
const db = require("./db")
const PORT = process.env.PORT || 2800
//USING BODY-PARSER TO TAKE DATA IN JSON FORMAT
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//IMPORITING USERROUTES TO USE
const userRoutes=require("./routers/userRoutes");
//ROUTING USERROUTES
app.use('/user',userRoutes);


//IMPORITING USERROUTES TO USE
const candidateRoutes=require("./routers/candidateRoute");
//ROUTING USERROUTES
app.use('/candidate',candidateRoutes);


const user = require("./routers/userRoutes");













//SERVER CONFIGURING WITH PORT
app.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT NO : ", PORT);
})