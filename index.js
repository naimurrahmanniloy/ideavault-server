const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();
const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const db = client.db("ideavault");
    const ideavaultCollection = db.collection("ideas");
    const commentCollection = db.collection("comments");

    app.post("/ideas", async (req, res) => {
      const ideaData = req.body;
      const result = await ideavaultCollection.insertOne(ideaData);
      res.send(result);
    });
    app.get("/ideas", async (req, res) => {
      const ideas = await ideavaultCollection.find().toArray();
      res.send(ideas);
    });

    app.get("/ideas/:id", async (req, res) => {
      const id = req.params;
      const idea = await ideavaultCollection.findOne({ _id: new ObjectId(id) });
      res.send(idea);
    });
    app.patch("/ideas/:id", async (req, res) => {
      const id = req.params;
      const updateData = req.body;
      const result = await ideavaultCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData },
      );
      res.send(result);
    });
    // Express route or Next.js Route Handler (/api/ideas/trending)
    app.get("/ideas", async (req, res) => {
      try {
        // Database theke tracking query run hobe ebong shudhu 3 ta return korbe
        const trendingIdeas = await Idea.find({ isTrending: true }) // condition thakle dibe, nahole khali find()
          .sort({ createdAt: -1 }) // (Optional) Newest items age anar jonno
          .limit(3); // <--- Ei line ti MongoDB theke strictly 3 ta data fetch korbe

        res.status(200).json(trendingIdeas);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Data fetch korte somossa hoyeche", error });
      }
    });
    app.post("/comments", async (req, res) => {
      try {
        const commentData = req.body;

        const result = await commentCollection.insertOne(commentData);

        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Failed to post comment" });
      }
    });
    app.get("/comments", async (req, res) => {
      try {
        const comments = await commentCollection.find().toArray();

        res.send(comments);
      } catch (error) {
        console.log(error);

        res.status(500).send({
          message: "Failed to get comments",
        });
      }
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
