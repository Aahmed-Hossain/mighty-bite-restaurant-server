const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aytkgnr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const productCollection = client.db("MightyBiteDB").collection("products");
    const featuredCollection = client.db("MightyBiteDB").collection("featuredProducts");
    const userCollection = client.db("MightyBiteDB").collection("users");

    app.get('/products', async(req, res)=>{
        let query = {};
        if (req.query?.category) {
          query = { category: req.query.category };
        }
        const result = await productCollection.find(query).toArray();
        res.send(result)
    })

    app.get('/featuredProducts', async(req, res)=>{
        const result = await featuredCollection.find().toArray();
        res.send(result)
    });

    app.post('/users', async(req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result)
    });










    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) =>{
    res.send('Mighty is busy with Eating')
})

app.listen(port, () =>{
    console.log(`Mighty Bite server is running on port: ${port}`);
})