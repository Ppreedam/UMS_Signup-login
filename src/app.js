require('dotenv').config();
const express = require("express");
const bcrypt = require("bcryptjs")
const path = require("path")
const hbs = require("hbs")
const jwt = require("jsonwebtoken")
require("../db/conn")

const Register = require("../models/registers")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//#####Adding index.html#####
// const static_path = path.join(__dirname,"../public")
// app.use(express.static(static_path))
//console.log(path.join(__dirname,"../public"))
//######complited##########

//#connecting hbs file#
// const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
//console.log(path.join(__dirname,"../templates/partials"))

const port = process.env.PORT || 8080

console.log(process.env.SECRET_KEY)

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/register", (req, res) => {
    res.render("register")
})


app.post("/register", async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        //const Phone= req.body.Phone;
        const gender = req.body.gender;
        const age = req.body.age;
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        console.log(name,email,gender,age,password,cpassword)

        if (password === cpassword) {

            const registerEmployee = new Register({
                name: req.body.name,
                email: req.body.email,
                password: password,
                cpassword: cpassword,
                gender: req.body.gender,
                age: req.body.age
            });


            console.log("the success part" + registerEmployee)
            const token = await registerEmployee.generateAuthToken();
            console.log("the token part" + token);

            const registered = await registerEmployee.save();
            res.status(201).render("login");

        }
        else {
            res.send("password are not matching")
        }

    } catch (error) {
        res.status(400).send(error)
    }
})




app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login", async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const useremail =await Register.findOne({email:email})
        // res.send(useremail.password);
        // console.log(useremail)
        //console.log(email,password)

        // if(useremail.password === password){
        //     res.status(201).render("index");
        // }
        // else{
        //     res.send("invalid login details")
        // }


        const ismatch =await bcrypt.compare(password,useremail.password);

        const token = await useremail.generateAuthToken();
            console.log("the token part" + token);

        if(ismatch){
            res.status(201).render("index");
        }
        else{
            res.send("invalid login details")
        }
    } catch (error) {
        res.status(400).send("Invalid Login Details")
    }
})
app.listen(port, () => {
    console.log("server is live on port 8080")
})