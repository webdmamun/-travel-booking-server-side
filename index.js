const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dnwup.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("toorDB");
    const servicesCollection = database.collection("services");
    const servicesBookCollection = database.collection("bookedservice");
    const hotelsCollection = database.collection("hotels");
    const bookedhotelCollection = database.collection("bookedhotel");

    //Get API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/hotels", async (req, res) => {
      const cursor = hotelsCollection.find({});
      const hotels = await cursor.toArray();
      res.send(hotels);
    });

    // get booked services
    app.get("/bookedservice", async (req, res) => {
      const cursor = servicesBookCollection.find({});
      const bookedServices = await cursor.toArray();
      res.send(bookedServices);
    });

    // get booked hotels
    app.get("/bookedhotel", async (req, res) => {
      const cursor = bookedhotelCollection.find({});
      const bookedHotel = await cursor.toArray();
      res.send(bookedHotel);
    });

    // add booked services
    app.post("/bookedservice", async (req, res) => {
      const bookedService = req.body;
      const result = await servicesBookCollection.insertOne(bookedService);
      res.json(result);
    });
    // add booked hotel
    app.post("/bookedhotel", async (req, res) => {
      const bookedHotel = req.body;
      const result = await bookedhotelCollection.insertOne(bookedHotel);
      res.json(result);
    });

    // Get Single Service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    app.get("/bookedservice/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesBookCollection.findOne(query);
      res.json(service);
    });
    // Get Single hotel
    app.get("/hotels/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const hotels = await hotelsCollection.findOne(query);
      res.json(hotels);

      app.get("/bookedhotel/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const bookedHotel = await bookedhotelCollection.findOne(query);
        res.json(bookedHotel);
      });

      // Delete Booked Service
      app.delete("/bookedservice/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await servicesBookCollection.deleteOne(query);
        res.json(result);
      });

      app.delete("/bookedhotel/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await servicesBookCollection.deleteOne(query);
        res.json(result);
      });
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Toor Travel Agency Server");
});

app.listen(port, () => {
  console.log("running Toor Travel Agency server on port", port);
});
