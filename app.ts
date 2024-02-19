import {Request, Response, Express} from "express";
import express from 'express'
import bodyParser from "body-parser";
import database from "./Database/dbConfig";
import {Favorite, Poll, Vote} from "./models/Model";

const cors = require('cors');
const app: Express = express();

app.use(cors());
app.use(express.json())

var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(urlencodedParser)

const PORT: Number = 3000;
const Root: "/" = "/";
let con: number = 0;
let connections: any = [];

const baseUrl = '/api/v1';


// Route.
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
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
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
        const newVote: Favorite = req.body as Favorite;

        const collectionName = "favorites";
        const collection = database.collection(collectionName);
        await collection.insertOne(newVote)

        res.status(200).send(newVote)
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



let Server = app.listen(PORT, () => {
    console.log("We the people API is now running on port " + PORT);
});

// Handle the connection.
Server.on("connection", (connection: any) => {
    connections.push(connection);

    connection.on("close", function () {
        connections = connections.filter((cur: any) => {
            cur !== connection
        })
    })
})

// Close the Connection.
connections.forEach((curr: any) => {
    curr.close();
});


module.exports = {app, Server}
