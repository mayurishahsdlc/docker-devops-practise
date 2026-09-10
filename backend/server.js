const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017";
const DB_NAME = process.env.DB_NAME || "devops_lab";

let dbStatus = "disconnected";

async function connectMongo() {
    try {
        const client = new MongoClient(MONGO_URL);

        await client.connect();

        console.log("MongoDB connected successfully");

        dbStatus = "connected";

        return client.db(DB_NAME);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        dbStatus = "disconnected";
    }
}

app.get("/", (req, res) => {
    res.json({
        application: "Docker DevOps Lab",
        message: "Backend is running",
        environment: process.env.NODE_ENV || "development"
    });
});

app.get("/health", (req, res) => {
    if (dbStatus === "connected") {
        return res.status(200).json({
            status: "healthy",
            database: "connected"
        });
    }

    res.status(503).json({
        status: "unhealthy",
        database: "disconnected"
    });
});

app.get("/info", (req, res) => {
    res.json({
        hostname: require("os").hostname(),
        node_version: process.version,
        environment: process.env.NODE_ENV || "development"
    });
});

connectMongo().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Backend running on port ${PORT}`);
    });
});
