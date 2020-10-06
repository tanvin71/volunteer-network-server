const ObjectId = require('mongodb').ObjectId;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.osbiw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000;





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
  const eventsCollection = client.db("volunteerNetwork").collection("events");
  const choiceCollection = client.db("volunteerNetwork").collection("registration");
  console.log('ok')
  app.get('/tasks', (req,res) => {
    eventsCollection.find({})
    .toArray((err, documents )=> {
      res.send(documents);
    })
  })
  app.post('/addEvent', (req, res) => {
      const events = req.body;
      console.log(events)
      eventsCollection.insertMany(events)
      .then(result  =>  {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
      })
    })
    


    app.post('/event',(req,res) => {
      const newEvent = req.body;
      choiceCollection.insertOne(newEvent)
      .then(result => {
        res.send(result.insertedCount > 0)
        console.log(result)
      })
      console.log(newEvent)
  })

     app.get('/choiceCollection' , (req,res) =>{
      //  console.log(req.query.email)
       choiceCollection.find({email: req.query.email})
       .toArray((err, documents) => {
         res.send(documents)
       })
     })

     app.delete('/delete/:id', (req, res) => {
       console.log(req.params.id)
      choiceCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then( (result) => {
         res.send(result.deletedCount > 0)
      })
  })
});



app.listen(process.env.PORT || Cport)