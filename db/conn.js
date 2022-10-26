const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Register_user")
.then(()=>{
    console.log("Database connection successful")
})
.catch(()=>{
    console.log("connection failed")
})