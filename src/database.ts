import { MongoClient, Db, Collection, type Sort, type Document } from "mongodb";
import express, { type Express, type Request, type Response, type NextFunction } from "express";

import { type Project, type Image } from "./types/index.ts";

// MongoDB Credentials
const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const UPLOADTHING_KEY = process.env.UPLOADTHING_KEY || "";

let client: MongoClient;
let database: Db;

async function _connectToMongoDB(): Promise<Db> {
    if (database) return database;

    try {
        console.log("User:" + USERNAME);
        console.log("Pass: " + PASSWORD);
        client = new MongoClient(
            `mongodb+srv://${USERNAME}:${PASSWORD}@portfolio-content.9mbe1sd.mongodb.net/?appName=portfolio-content`,
            {
                appName: "portfolio-server",
            },
        );

        await client.connect();

        database = client.db("content");
        console.log("Connected to database " + database.databaseName);
        return database;
    } catch (err) {
        throw err;
    }
}

let connect$: Promise<Db>;

export async function connectToMongoDB(): Promise<Db> {
    connect$ ??= _connectToMongoDB();
    return await connect$;
}

export function getCollection<T extends Document>(collectionName: string): Collection<T> {
    if (!database) throw new Error("Database not connected!");

    return database.collection(collectionName);
}

export async function getAllProjects(req: Request, res: Response): Promise<void> {
    const projectCollection = getCollection("projects");

    let projects = await projectCollection.find().toArray();
    res.status(200).json(projects);
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
    await client?.close();
}

export async function getAllImages(req: Request, res: Response): Promise<void> {
    let response = await fetch("https://api.uploadthing.com/v6/listFiles", {
        method: "POST",
        headers: {
            "X-Uploadthing-Api-Key": UPLOADTHING_KEY,
        },
        body: JSON.stringify({
            limit: 500,
            offset: 0,
        }),
    }).then((res) => res.json());

    let images: Image[] = [];

    for (let i of response.files) {
        images.push({ name: i.name, key: i.key });
    }

    res.status(200).json(images);
}

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            fn(req, res, next).catch(next);
        } catch (error) {
            next(error);
        }
    };
}
