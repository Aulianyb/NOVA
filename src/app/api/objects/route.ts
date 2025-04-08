import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "../auth/session";
import Object from "../../../../model/Object";
import World from "../../../../model/World"; 
import { errorhandling, verifyWorld } from "../function";

export async function GET(req:NextRequest){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { searchParams } = new URL(req.url);
        const worldID = searchParams.get("worldID");
        if (!worldID){
            throw new Error("World ID is missing");
        }
        const world = await verifyWorld(worldID, userID);

        const worldObjects = await Object.find({ _id: { $in: world.objects } })
        return NextResponse.json({ data : worldObjects, message : "Objects Fetched!"}, { status: 200 });
    } catch(error){
        return errorhandling(error);
    }
}

export async function POST(req:NextRequest){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const worldID = data.worldID;
        await verifyWorld(worldID, userID);

        // UPSERT
        const nodes = data.nodes;


        const operations = await nodes.map((node: {
            id: string;
            data: {
                objectName: string;
                objectDescription: string;
                objectPicture: string;
                tags: string[];
                images: string[];
                relationships: string[];
            };
            position: {
                x: number;
                y: number;
            }
        })=>({
            updateOne : {
                filter: { _id: node.id },
                update: {
                    objectName : node.data.objectName,
                    objectDescription : node.data.objectDescription,
                    objectPicture : node.data.objectPicture,
                    positionX : node.position.x,
                    positionY : node.position.y,
                    tags : node.data.tags,
                    relationships : node.data.relationships,
                    images : node.data.images,
                    worldID : worldID,
                },
                upsert: true
            }
        }));


        const result = await Object.bulkWrite(operations);
        const createdObjects = (globalThis.Object).values(result.upsertedIds);
        await World.updateOne({_id: worldID}, { $push: { objects : createdObjects } });

        return NextResponse.json({ data : result, message : "New Object Created!"}, { status: 200 });
    } catch(error){
        return errorhandling(error); 
    }
}