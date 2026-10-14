import express, { type Express, type Request, type Response } from "express";

import * as db from "./database.ts";

const app: Express = express();
const port = 3100;

app.use(express.static("static"));

app.get("/content", db.asyncHandler(db.getAllProjects));

app.get("/images", db.asyncHandler(db.getAllImages));

async function startServer() {
    try {
        // Connect to MongoDB database
        await db.connectToMongoDB();

        // Start the Express server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.log("Failed to start server:", error);

        // Exit the process if we can't start properly
        // This ensures the application doesn't run in a broken state
        process.exit(1);
    }
}

process.on("SIGINT", () => {
    console.log("SIGINT detected. Disconnecting...");
    db.disconnectFromMongoDB();
    console.log("Shutting down");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("SIGTERM detected. Disconnecting...");
    db.disconnectFromMongoDB();
    console.log("Shutting down");
    process.exit(0);
});

startServer();
