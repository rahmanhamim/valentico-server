const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;

// user: valentico;
// password: euY3tSmh6vDcclNu;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4rb3w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
});

// ------------

async function run() {
 try {
  await client.connect();
  const database = client.db("valentico");
  const productsCollection = database.collection("products");
  const orderCollection = database.collection("orders");
  const usersCollection = database.collection("users");

  // GET API
  app.get("/products", async (req, res) => {
   const cursor = productsCollection.find({});
   const products = await cursor.toArray();
   res.send(products);
  });

  // GET API SINGLE PRODUCT
  app.get("/product/:id", async (req, res) => {
   const id = req.params.id;
   const query = { _id: ObjectId(id) };
   const product = await productsCollection.findOne(query);
   res.send(product);
  });

  // GET API MY ORDERS
  app.get("/myorders", async (req, res) => {
   const email = req.query.email;
   const query = { email: email };
   const cursor = orderCollection.find(query);
   const orders = await cursor.toArray();
   res.json(orders);
  });

  // POST API ORDERS
  app.post("/orders", async (req, res) => {
   const order = req.body;
   const result = await orderCollection.insertOne(order);
   res.json(result);
  });

  // POST API USERS DATA
  app.post("/users", async (req, res) => {
   const user = req.body;
   const result = await usersCollection.insertOne(user);
   res.json(result);
  });

  // -----------------
  // -----------------
 } finally {
  // await client.close();
 }
}
run().catch(console.dir);

// ----------------------------------------------
app.get("/", (req, res) => {
 res.send("Valentico Server Running!");
});

app.listen(port, () => {
 console.log(`valentico server listening to http://localhost:${port}`);
});
