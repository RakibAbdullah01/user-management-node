const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;


const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ed7sj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const userCollection = client.db("randomUsers").collection("users");
async function run(){
    try{
        await client.connect();

        // Insert One User
        app.post('/addUsers',async(req,res)=>{
            const result = await userCollection.insertOne(req.body);
            res.send(result);
        })

        // Get all Users
        app.get('/users',async(req,res)=>{
          const result = await userCollection.find({}).toArray()
          res.json(result)
        })

        // Get one user
        app.get('/users/:id', async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const user = await userCollection.findOne(query);
          // console.log('load user with id: ', id);
          res.send(user);
        })

        //UPDATE API
        app.put('/users/:id', async (req, res) => {
          const id = req.params.id;
          const updatedUser = req.body;
          const filter = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                  name: updatedUser.name,
                  email: updatedUser.email,
                  selary: updatedUser.selary
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
          })


        // Delete User
        app.delete('/users/:id',async(req,res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)}
          const result = await userCollection.deleteOne(query)
          console.log(result);
          res.send(result);
        })




    }finally{
        // client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})