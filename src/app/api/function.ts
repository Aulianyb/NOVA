import { NextResponse } from "next/server";
import World from "@model/World";
import mongoose from "mongoose";
import Object from "@model/Object";
import Relationship from "@model/Relationship";
import { connectToMongoDB } from "@/app/lib/connect";
import jwt from "jsonwebtoken";
import { getSession } from "./auth/session";

export function errorHandling(error : unknown){
    console.log(error);
    if (error instanceof Error) {
        if (error.message === "No session found" || error.message === "You are not the owner of this world") {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
        { message : error },
        { status: 500 }
    );
}

export async function verifyWorld(worldID : string, userID : string){;
    if (!mongoose.Types.ObjectId.isValid(worldID)) {
        throw new Error("Invalid world ID format");
    }
    const world = await World.findById(worldID);
    if (!world){
        throw new Error("World not found");
    }
    if (!world.owners.includes(userID) && !world.collaborators.includes(userID)){
        throw new Error("You are not the owner of this world");
    }
    return world; 
}

export async function verifyObject(objectID : string){
    if (!mongoose.Types.ObjectId.isValid(objectID)) {
        throw new Error("Invalid object ID format");
    }
    const object = await Object.findById(objectID); 
    if (!object){
        throw new Error("Object not found");
    }
    return object;
}

export async function verifyRelationship(relationshipID : string){
    if (!mongoose.Types.ObjectId.isValid(relationshipID)) {
        throw new Error("Invalid relationship ID format");
    }
    const relationship = await Relationship.findById(relationshipID); 
    if (!relationship){
        throw new Error("Relationship not found");
    }
    return relationship;
}

export async function verifyUser() {
    await connectToMongoDB();
    const session = await getSession();
    if (!session){
        return null;
    } else{
        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(session.token, JWT_SECRET!) as jwt.JwtPayload & { id: string };
        const userID = decoded.id
        return userID;
    }
}