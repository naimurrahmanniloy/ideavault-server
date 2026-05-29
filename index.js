const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ideavault-client-tau.vercel.app",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }),
);

app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const db = client.db("ideavault");

    const ideavaultCollection = db.collection("ideas");

    app.get("/", (req, res) => {
      res.send("Server is running");
    });

    app.get("/ideas", async (req, res) => {
      const ideas = await ideavaultCollection.find().toArray();

      res.send(ideas);
    });

    app.post("/ideas", async (req, res) => {
      try {
        const result = await ideavaultCollection.insertOne(req.body);

        res.send(result);
      } catch (error) {
        console.log(error);

        res.status(500).send(error);
      }
    });

    app.patch("/ideas/:id", async (req, res) => {
      try {
        const id = req.params.id;

        const result = await ideavaultCollection.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: req.body,
          },
        );

        res.send(result);
      } catch (error) {
        console.log(error);

        res.status(500).send(error);
      }
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
}

run();

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
