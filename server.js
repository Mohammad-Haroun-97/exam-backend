"use strict";
const express = require("express");

const cors = require("cors");

const axios = require("axios");

require("dotenv").config();

const server = express();

server.use(cors());

server.use(express.json());
const PORT = process.env.PORT;

const mongoose = require("mongoose");

let fruitsModel;
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGOOSE_URL);

  const fruitsSchema = new mongoose.Schema({
    userEmail: String,
    name: String,
    image: String,
    price: Number,
  });

   fruitsModel = mongoose.model("Fruits", fruitsSchema);
}

// Routes



// http://localhost:3100/getStaticFruits
server.get("/getStaticFruits", staticFruits);

// http://localhost:3100/addToFav
server.post('/addToFav',adToFavHandeler);

// http://localhost:3100/getFromDataBase
server.get('/getFromDataBase',getFromDataBaseHandeler)

// http://localhost:3100/update
server.put('/update/:id',updateHandeler)

// http://localhost:3100/delete
server.delete('/delete/:id',deleteHandeler)












// Handelers

function staticFruits(req, res) {
  axios
    .get(`https://fruit-api-301.herokuapp.com/getFruit`)
    .then((result) => {
      res.send(result.data.fruits);
    })
    .catch((error) => {
      console.log(`error`);
    });
}


async function adToFavHandeler(req,res) {

   const {userEmail,name,image,price}=req.body

await fruitsModel.create({

    userEmail: userEmail,
    name: name,
    image: image,
    price: price,

})

    
}

function getFromDataBaseHandeler(req,res) {

    const userEmail=req.query.userEmail;

    fruitsModel.find({userEmail:userEmail},(err,result)=>{
        if (err) {
            console.log(error);
            
        }
        else{
            res.send(result)
        }
    })


    
}


function updateHandeler(req,res) {
    

    console.log(`req.body`);
    
    const id =req.params.id
    const {userEmail, name ,  image ,  price }=req.body;

    fruitsModel.findByIdAndUpdate(id, {name ,  image ,  price}, (err,result)=>{
        fruitsModel.find({userEmail:userEmail}, (err,result)=>{

            if (err) {
                console.log(`error`);
            }
            else{
                res.send(result)
            }
        })
    } )


    
}


function deleteHandeler(req,res) {

    const id =req.params.id;
    const userEmail=req.query.userEmail;

    fruitsModel.deleteOne({_id:id},(err,result)=>{
        fruitsModel.find({userEmail:userEmail},(err,result)=>{
            if (err) {
                console.log(`error`);
                
            }
            else{
                res.send(result)
            }
        })
    })



    
}











server.listen(PORT, () => {
  console.log(`you are listnining to this port ${PORT}`);
});
