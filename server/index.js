const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
require('dotenv').config()
console.log(process.env) 
const uri = "mongodb+srv://" + process.env.MONGO + ".mongodb.net/?retryWrites=true&w=majority&appName=Highscores";
const PORT = process.env.PORT || 3001;

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected")
    } catch (error) {
        console.error(error)
    }
}
  
  
connect()

const highscoreSchema = new mongoose.Schema({
    username: String,
    waves: Number
});
const Highscore = mongoose.model('Highscore', highscoreSchema);

const app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get("/api/getTop", async(req, res) => {
    const entries = await Highscore.find({}).sort("-waves").limit(5);
    res.status(200).send(entries);
})

app.post("/api/addScore", async(req, res) => {
    try {
        const entrydetails = req.body;
        const newEntry = new Highscore({username: entrydetails.username, waves: entrydetails.waves})
        await newEntry.save()
        res.status(200).json({
        status: "success",
        message: "Entry created"
        })
    } catch (err) {
        res.status(500).json({
        status: "error",
        message: 'Database error: ' + err.message
        })
    }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
