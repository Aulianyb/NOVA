import { NextResponse } from "next/server";
import World from "../../../model/World";
import mongoose from "mongoose";
import Object from "../../../model/Object";

export function errorhandling(error : unknown){
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

export async function verifyWorld(worldID : string, userID : string){
    if (!mongoose.Types.ObjectId.isValid(worldID)) {
        throw new Error("Invalid world ID format");
    }
    const world = await World.findById(worldID);
    if (!world){
        throw new Error("World not found");
    }
    if (!world.owners.includes(userID)){
        throw new Error("You are not the owner of this world");
    }
    return world; 
}

export async function verifyObject(objectID : string, userID : string){
    if (!mongoose.Types.ObjectId.isValid(objectID)) {
        throw new Error("Invalid object ID format");
    }
    const object = await Object.findById(objectID); 
    if (!object){
        throw new Error("Object not found");
    }
    const world = await World.findById(object.worldID);
    if (!world.owners.includes(userID)){
        throw new Error("You are not the owner of this world");
    }
    return object;
}