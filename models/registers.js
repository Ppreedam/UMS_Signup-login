const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const emplooyeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
        
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    
})
// generating tokens
emplooyeeSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString( ) }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        //console.log(token);
        return token;
    } catch (error) {
        resizeBy.send("the error part" + error);
        console.log("the error part" + error)
    }
}

//converting password into hash
emplooyeeSchema.pre("save", async function(next){

    if(this.isModified("password")){
       // const passwordHash = await bcrypt.hash(this.password, 10);
        //console.log(`the current password id ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10)
        //console.log(`the current password id ${this.password}`);
         //this.cpassword = undefined;
        this.cpassword = await bcrypt.hash(this.password, 10)

    } 
    next()
})

const Register = new mongoose.model("Register_data",emplooyeeSchema);
module.exports = Register