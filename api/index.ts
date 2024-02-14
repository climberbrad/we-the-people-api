import express, {Request, Response} from 'express'
import {Document, MongoClient, ServerApiVersion, WithId} from "mongodb";

interface Poll extends WithId<Document> {
    id: string;
    startDate: number;
    question: string;
    options: PollOption[];
    author: string;
    status: string;
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

const app = express();

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

app.get("/", (req, res) => {
    res.send("We the people API");
});

const baseUrl = '/api/v1';
app.get(`${baseUrl}/polls`, async (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');

    // res.status(200).send(JSON.stringify({name: 'brad', test: uri}, null, 3))
    try {
        const collectionName = "polls";
        const collection = database.collection(collectionName);
        const posts = await (collection.find().toArray()) as Poll[];

        res.status(200).send(JSON.stringify(posts, null, 3))
    } catch {
        console.log('error')
    }
})

app.listen(3000, () => {
    console.log("Running on port 3000.");
});

// Export the Express API
module.exports = app;