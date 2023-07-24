const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000



// middle wares 
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))









const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@education-master.mosso36.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect((err) => {

            console.log(err)
            return
        });
        const reviewCollection = client.db('education_master').collection('reviews')
        const collegeCollection = client.db('education_master').collection('colleges')
        const galaryCollection = client.db('education_master').collection('galary')

        // operations 
        // get all colleges 
        app.get('/colleges', async (req, res) => {
            const limitStr = req.query.limit
            let limit = 0
            if (limitStr) {
                limit = parseInt(limitStr)
            }
            console.log(limit)
            const colleges = await collegeCollection.find().limit(limit).toArray()
            res.send(colleges)
        })

        // get college by id 
        app.get('/colleges/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const college = await collegeCollection.findOne(query)
            res.send(college)
        })

        // get galary images 
        app.get('/galary', async (req, res) => {
            const images = await galaryCollection.find().toArray()
            res.send(images)
        })

        // get reviews 
        app.get('/reviews', async (req, res) => {
            const reviews = await reviewCollection.find().toArray()
            res.send(reviews)
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
    res.send('Welcome to the education master server')
})

app.listen(port, () => {
    console.log('education master listening on port', port)
})