
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Connect to MongoDB with database name
mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://22pa1a0247:AvzZ481xADJKbw2U@cluster0.ss1vmob.mongodb.net/solar?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Define a schema for your data
const dataSchema = new mongoose.Schema({
  msg: String,
  timestamp: Number

}, {
  // Exclude _id and __v fields from the document
  versionKey: false,
  toJSON: { 
    virtuals: true, 
    transform: (doc, ret) => { 
      delete ret.__v; 
      return ret; 
    }
  },
  // Exclude _id from the JavaScript object
  toObject: { 
    transform: (doc, ret) => { 
      delete ret._id; 
      return ret; 
    } 
  }
});

// Create a model based on the schema and specify the collection name
const DataModel = mongoose.model("Data", dataSchema, "sendData");

app.use(bodyParser.json());
app.use(cors());

app.post('/sendData', async (req, res) => {
  try {
    const jsonData = req.body;
    // Create a new document using the model and save it to MongoDB
    const newData = new DataModel(jsonData);
    await newData.save();
    console.log('Data saved to MongoDB:', newData);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling data:', error);
    res.sendStatus(500);
  }
});
// app.get('/getdata',function(req,res){
//   res.sendFile(__dirname + '/receivedData.json');
//   console.log('sent!!')
//   });
