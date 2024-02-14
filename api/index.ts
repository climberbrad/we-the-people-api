import express from 'express'

const app = express();

app.get("/", (req, res) => {
    res.send("We the people API");
});

app.listen(5000, () => {
    console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;