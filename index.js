const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://home-tutor-kbph.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7oyvz.mongodb.net/?appName=Cluster0`;

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
    // Database & Collection name
    const db = client.db("homeTutorDB");
    const userCollection = db.collection("users");
    const tutorCollection = db.collection("tutors");
    const courseCollection = db.collection("courses");
    const questionCollection = db.collection("questions");
    const messageCollection = db.collection("messages");
    const solutionCollection = db.collection("solutions");
    const subjectWiseSolutionCollection = db.collection("subjectWiseSolution");
    const blogCollection = db.collection("blogs");
    const resultCollection = db.collection("results");

    // Save or update an user in db
    app.post("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = req.body;
      const isExist = await userCollection.findOne(query);
      if (isExist) {
        return res.send(isExist);
      }
      const result = await userCollection.insertOne({
        ...user,
        role: "student",
        timestamp: Date.now(),
      });
      res.send(result);
    });

    // Update User data
    app.patch("/user/:id", async (req, res) => {
      try {
        const id = req.params.id; // Get id from URL
        const updatedData = req.body; // Data you want to update

        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: updatedData,
        };

        const result = await userCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated successfully", result });
      } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
      }
    });

    //   Get user data
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    //   Get user data by specific email
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // Post single Question
    app.post("/question", async (req, res) => {
      const newQuestion = req.body;
      const result = await questionCollection.insertOne(newQuestion);
      res.send(result);
    });

    // Get all question
    app.get("/questions", async (req, res) => {
      try {
        const questions = await questionCollection.find().toArray();
        res.send(questions);
      } catch (error) {
        res.send(error.message);
      }
    });

    // Delete a question by questionId
    app.delete("/questions/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { questionId: id }; // assuming you're storing questionId as a string

        const result = await questionCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Question not found" });
        }

        res.json({ message: "Question deleted successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error deleting question", error });
      }
    });

    // Post add Tutor
    app.post("/tutor", async (req, res) => {
      const tutor = req.body;
      const result = await tutorCollection.insertOne(tutor);
      res.send(result);
    });

    // Get all tutors
    app.get("/tutors", async (req, res) => {
      try {
        const tutors = await tutorCollection.find().toArray();
        res.send(tutors);
      } catch (error) {
        res.send(error.message);
      }
    });

    // Get specific tutor by id
    app.get("/tutor/:id", async (req, res) => {
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
    });

    // Post Note Data
    app.post("/note", async (req, res) => {
      const solution = req.body;
      const result = await solutionCollection.insertOne(solution);
      res.send(result);
    });

    // Get all solutions
    app.get("/solutions", async (req, res) => {
      try {
        const solutions = await solutionCollection.find().toArray();
        res.send(solutions);
      } catch (error) {
        res.send(error.message);
      }
    });

    // Get specific solution by questionId
    app.get("/solution/:id", async (req, res) => {
      try {
        const questionId = req.params.id; // Get ID from request params
        const query = { questionId: questionId };

        const solution = await solutionCollection.findOne(query); // Await the result

        if (!solution) {
          return res.status(404).json({ message: "Solution not found" });
        }

        res.json(solution);
      } catch (error) {
        res.status(500).json({ message: "Error fetching solution", error });
      }
    });

    // Post subject wise solution
    app.post("/subject-wise-solution", async (req, res) => {
      const solution = req.body;
      const result = await subjectWiseSolutionCollection.insertOne(solution);
      res.send(result);
    });

    // Get all subject wise solution
    app.get("/subject-wise-solution", async (req, res) => {
      try {
        const subjectWiseSolution = await subjectWiseSolutionCollection
          .find()
          .toArray();
        res.send(subjectWiseSolution);
      } catch (error) {
        res.send(error.message);
      }
    });

    // Get specific solution by solutionId
    app.get("/subject-wise-solution/:id", async (req, res) => {
      try {
        const solutionId = req.params.id; // Get ID from request params
        const query = { solutionId: solutionId };

        const result = await subjectWiseSolutionCollection.findOne(query); // Await the result

        if (!result) {
          return res.status(404).json({ message: "Solution not found" });
        }

        res.json(result);
      } catch (error) {
        res.status(500).json({ message: "Error fetching solution", error });
      }
    });

    // Post Course Data
    app.post("/course", async (req, res) => {
      const course = req.body;
      const result = await courseCollection.insertOne(course);
      res.send(result);
    });

    // Get all courses
    app.get("/courses", async (req, res) => {
      try {
        const courses = await courseCollection.find().toArray();
        res.send(courses);
      } catch (error) {
        res.send(error.message);
      }
    });

    // Get specific solution by questionId
    app.get("/courses/:id", async (req, res) => {
      try {
        const id = req.params.id; // Get ID from request params
        const query = { _id: new ObjectId(id) };

        const course = await courseCollection.findOne(query); // Await the result

        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }

        res.json(course);
      } catch (error) {
        res.status(500).json({ message: "Error fetching course", error });
      }
    });

    // Blog post api
    app.post("/blog", async (req, res) => {
      const newBlog = req.body;
      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    });

    // Get Blog data
    app.get("/blog", async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
    });


    // Post result 
    app.post("/add-result", async (req, res) => {
      const newResult = req.body;
      const result = await resultCollection.insertOne(newResult);
      res.send(result);
    });
    
  // Get all result
  app.get('/results', async (req, res) => {
    try {
      const results = await resultCollection.find().toArray();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching results', error });
    }
  });

  
  // Get result by student ID
app.get('/result', async (req, res) => {
  const{ studentId, examName }= req.query;
    const result = await resultCollection.findOne({ studentId, examName });
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.json(result);
});


    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
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

app.get("/", (req, res) => {
  res.send("Welcome to my server");
});

app.listen(port, () => {
  console.log(`Home tutor app is running on the port ${port}`);
});
