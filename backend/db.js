// requiring mongoose 
const mongoose = require('mongoose');

// MongoDB URI for local Database
const mongooseURI = "mongodb://localhost:27017/iNotesDB";

// function to connect with mongoDB Database.
const connectToMongo = ()=>{
    mongoose.connect(mongooseURI, ()=>{
    console.log("Connected successfully");
    })
}

// export the above function so that server uses the database.
module.exports = connectToMongo;