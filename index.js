const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

// Post single Question
    app.post('/question', async(req,res) => {
        const newQuestion = req.body;
        const result = await questionCollection.insertOne(newQuestion);
        res.send(result)
    })

// Get all question
app.get('/questions', async(req,res) => {
    try{
        const questions = await questionCollection.find().toArray();
        res.send(questions)

    }catch(error){
        res.send(error.message)
    }
})

// Get all tutors
app.get('/tutors', async(req,res) => {
    try{
        const tutors = await tutorCollection.find().toArray();
        res.send(tutors)

    }catch(error){
        res.send(error.message)
    }
})

// Get specific tutor by id
app.get('/tutor/:id', async(req,res) => {
    try {
        const id = req.params.id; // Get ID from request params
        const query = { _id: new ObjectId(id) }; // Convert to ObjectId

        const tutor = await tutorCollection.findOne(query); // Await the result

        if (!tutor) {
            return res.status(404).json({ message: "Tutor not found" });
        }

        res.json(tutor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tutor", error });
    }
})

// Post Note Data
app.post('/note', async(req,res) => {
    const solution = req.body;
    const result = await solutionCollection.insertOne(solution);
    res.send(result)
})


// Get all solutions
app.get('/solutions', async(req,res) => {
    try{
        const solutions = await solutionCollection.find().toArray();
        res.send(solutions)

    }catch(error){
        res.send(error.message)
    }
})

// Get specific solution by questionId
app.get('/solution/:id', async(req,res) => {
    try {
        const questionId = req.params.id; // Get ID from request params
        const query = { questionId : questionId }; 

        const solution = await solutionCollection.findOne(query); // Await the result

        if (!solution) {
            return res.status(404).json({ message: "Solution not found" });
        }

        res.json(solution);
    } catch (error) {
        res.status(500).json({ message: "Error fetching solution", error });
    }
})

// Post Course Data
app.post('/course', async(req,res) => {
    const course = req.body;
    const result = await courseCollection.insertOne(course);
    res.send(result)
})


// Get all courses
app.get('/courses', async(req,res) => {
    try{
        const courses = await courseCollection.find().toArray();
        res.send(courses)

    }catch(error){
        res.send(error.message)
    }
})

// Get specific solution by questionId
app.get('/courses/:id', async(req,res) => {
    try {
        const id = req.params.id; // Get ID from request params
        const query = { _id : new ObjectId(id) }; 

        const course = await courseCollection.findOne(query); // Await the result

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Error fetching course", error });
    }
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