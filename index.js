const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion  } = require("mongodb");
const { ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rms22hp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("SodiumCafe").collection("menu");
    const reviewCollection = client.db('SodiumCafe').collection('review');
    const cartCollection = client.db('SodiumCafe').collection('cart');

    // ...............................................................................
    // ................get all data................................................

    app.get("/menues", async (req, res) => {
      const cursor = menuCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
// .....................creating cart................................................
    app.post("/carts", async (req, res) => {
      const item = req.body;
      // console.log(item);
      const result = await cartCollection.insertOne(item);
      res.send(result);
    })
//......................show cart data...............................................
app.get('/carts', async(req, res) => {
  const email = req.query.email;
  // console.log(email);
  if(!email) {
    res.send([]);
  }  
  const query = { email: email };
  const result = await cartCollection.find(query).toArray();
  res.send(result);
});
app.delete('/carts/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await cartCollection.deleteOne(query);
  res.send(result);
})




    // .............................................................................
    // Send a ping to confirm a successful connection...............................
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// check check check
app.get("/", (req, res) => {
  res.send("sodium cafe server is running.");
});
app.listen(port, () => {
  console.log(`sodium cafe server is runnung on port: ${port}`);
});