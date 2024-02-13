import express, {Request, Response} from 'express'
import database from "../Database/dbConfig";
import {Document, WithId} from "mongodb";

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

app.get("/", (req, res) => {
    res.send("Express on Vercel");
});

const baseUrl = '/api/v1';
app.get(`${baseUrl}/polls`, async (req: Request, res: Response) => {
    console.log('here')
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

app.listen(3000, () => {
    console.log("Running on port 3000.");
});

// Export the Express API
module.exports = app;