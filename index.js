const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()


//middleware
app.use(
    cors({
        origin: 'https://notekhata-online-notebook.web.app'
    })
);
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dcocwar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const noteCollection = client.db('NotekhataDB').collection('UserNote');


        // create notes and send to db;

        app.post('/notes', async (req, res) => {
            const notesList = req.body;
            const result = await noteCollection.insertOne(notesList)
            res.send(result);
        })

        
        // find or bring data from db;

        app.get('/notes', async (req, res) => {
            const result = await noteCollection.find().toArray();
            res.send(result);
        })

        // delete users note from db;

        app.delete('/notes/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await noteCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/notes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await noteCollection.findOne(query);
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})