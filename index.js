const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();


// Middleware
app.use(cors(
    {
        origin: [
            'http://localhost:5173',
            'http://localhost:5174',
            'https://home-tutor-kbph.netlify.app',


        ], 
        credentials: true,
    }
))
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7oyvz.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {



    // Database & Collection name
    const db = client.db("homeTutorDB");
    const userCollection = db.collection("users");
    const tutorCollection = db.collection("tutors");
    const courseCollection = db.collection("courses");
    const questionCollection = db.collection("questions");
    const messageCollection = db.collection("messages");
    const solutionCollection = db.collection("solutions");


    app.post('/question', async(req,res) => {
        const newQuestion = req.body;
        const result = await questionCollection.insertOne(newQuestion);
        res.send(result)
    })




    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req,res) => {
    res.send("Welcome to my server")
})

app.listen(port, () => {
    console.log(`Home tutor app is running on the port ${port}`)
})