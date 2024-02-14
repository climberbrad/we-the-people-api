import express, {Request, Response, Express} from "express";
import {configDotenv} from "dotenv";
import {MongoClient, ServerApiVersion} from "mongodb";
import {Poll, Vote} from "../models/Model";

configDotenv()

const uri = process.env.MONGODB_URI || '';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client: MongoClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let conn;
try {
    // Connect the client to the server	(optional starting in v4.7)
    conn = client.connect();
} catch (e) {
    console.error(e);
}
const dbName = "we-the-people";
const database = client.db(dbName);

const cors = require('cors');
const app: Express = express();

app.use(cors());
app.use(express.json());

const Root: "/" = "/";
const baseUrl = '/api/v1';

app.get(Root, async (req: Request, res: Response) => {
    console.log('here')
    res.status(200)
    res.setHeader('Content-Type', 'application/json');
    res.json({
        data: 'success',
        Type: true,
    });
})

app.get(`${baseUrl}/polls`, async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const collectionName = "polls";
        const collection = database.collection(collectionName);
        const posts = await (collection.find().toArray()) as Poll[];

        res.status(200).send(JSON.stringify(posts, null, 3))
    } catch {
        console.log('error')
    }
})

app.get(`${baseUrl}/polls/:id`, async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    const pollId = req.params.id
    try {
        const collectionName = "polls";
        const collection = database.collection(collectionName);
        const poll = await (collection.findOne({id: pollId})) as Poll;

        res.status(200).send(JSON.stringify(poll, null, 3))
    } catch {
        console.log('error')
    }
})

app.post(`${baseUrl}/polls`, async (req: Request, res: Response) => {
    // res.setHeader('Content-Type', 'application/json');
    try {
        const newPoll: Poll = req.body as Poll;

        const collectionName = "polls";
        const collection = database.collection(collectionName);
        await collection.insertOne(newPoll)

        res.status(200).send(newPoll)
    } catch (e) {
        console.log('error', e)
    }
})

app.get(`${baseUrl}/votes`, async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
        const collectionName = "votes";
        const collection = database.collection(collectionName);
        const votes = await (collection.find().toArray()) as Vote[];

        res.status(200).send(JSON.stringify(votes, null, 3))
    } catch {
        console.log('error')
    }
})

app.post(`${baseUrl}/votes`, async (req: Request, res: Response) => {
    // res.setHeader('Content-Type', 'application/json');
    try {
        const newVote: Vote = req.body as Vote;

        const collectionName = "votes";
        const collection = database.collection(collectionName);
        await collection.insertOne(newVote)

        res.status(200).send(newVote)
    } catch (e) {
        console.log('error', e)
    }
})


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});