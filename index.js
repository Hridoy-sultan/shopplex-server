const express = require('express');
const nodemon = require('nodemon');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ucd7g.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err);

    const ProductCollection = client.db("shopplex").collection("shopplexCollection");
    console.log('database connected');



    app.get('/gifts', (req, res) => {
        ProductCollection.find()
            .toArray((err, items) => {
                res.send(items)

            })
    });

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        ProductCollection.insertOne(product)
            .then(result => {
                res.send(result.insertedCount > 0)

            })


    })

});




app.listen(process.env.PORT || port);

