import {MongoClient, ServerApiVersion} from "mongodb";
const uname = process.env.VITE_MONGO_USER;
const pwd = process.env.VITE_MONGO_PWD;

const uri = `mongodb+srv://${uname}:${pwd}@cluster0.impkuwn.mongodb.net/?retryWrites=true&w=majority`;

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

export default database;