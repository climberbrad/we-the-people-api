import express, {Request, Response, Express, query} from "express";
import {configDotenv} from "dotenv";
import {MongoClient, ServerApiVersion} from "mongodb";
import {Favorite, Poll, Vote} from "../models/Model";

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

const updatePoll = async (update: Poll): Promise<boolean> => {
    try {
        const collectionName = "polls";
        const collection = database.collection(collectionName);
        const existingDocument = await (collection.findOne({id: update.id}));

        if (existingDocument) {
            await collection.findOneAndReplace(
                {_id: {$eq: existingDocument._id}}, {...update, _id: existingDocument._id}, {upsert: false}
            )
        }

        return true

    } catch (e) {
        console.log('error', e)
    }

    return false
}

app.get(Root, async (req: Request, res: Response) => {
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

app.put(`${baseUrl}/polls/:id`, async (req: Request, res: Response) => {
    // res.setHeader('Content-Type', 'application/json');
    try {
        const pollId = req.params.id
        const updatedPoll: Poll = req.body as Poll;

        if (pollId !== updatedPoll.id) {
            throw new Error('Update ID and url path param do not match')
        }

        const collectionName = "polls";
        const collection = database.collection(collectionName);
        const existingDocument = await (collection.findOne({id: pollId}));

        if (existingDocument) {
            await collection.findOneAndReplace(
                {_id: {$eq: existingDocument._id}}, {...updatedPoll, _id: existingDocument._id}, {upsert: true}
            )
            res.status(200).send(updatedPoll);
        }
        res.status(500);

    } catch (e) {
        console.log('error', e)
    }
})

app.get(`${baseUrl}/favorites`, async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    try {
        const collectionName = "favorites";
        const collection = database.collection(collectionName);
        const votes = await (collection.find().toArray()) as Vote[];

        res.status(200).send(JSON.stringify(votes, null, 3))
    } catch {
        console.log('error')
    }
})

app.post(`${baseUrl}/favorites`, async (req: Request, res: Response) => {
    // res.setHeader('Content-Type', 'application/json');
    try {
        const favorite: Favorite = req.body as Favorite;

        const collectionName = "favorites";
        const collection = database.collection(collectionName);

        const existingDocument = await (collection.findOne({userId: favorite.userId}));
        if (existingDocument) {
            await collection.findOneAndReplace(
                {_id: {$eq: existingDocument._id}}, {...favorite, _id: existingDocument._id}, {upsert: true}
            )
        } else {
            await collection.insertOne(favorite)
        }

        res.status(200).send(favorite)
    } catch (e) {
        console.log('error', e)
    }
})

// const ETL = async () => {
//     console.log('---running ETL---')
//     const pollCollection = database.collection("polls");
//     const posts = await (pollCollection.find().toArray()) as Poll[];
//
//     const voteCollection = database.collection("votes");
//     const votes = await (voteCollection.find().toArray()) as Vote[];
//
//     posts.map(poll => {
//         const existingVotes = votes.filter(vote => vote.pollId === poll.id)
//         const updatedPoll = {...poll, votes: [...existingVotes]}
//
//         updatePoll(updatedPoll)
//     })
// }

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("We the people API is running on port " + PORT);
});

