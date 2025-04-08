import { NextResponse } from "next/server";
import World from "../../../model/World";
import mongoose from "mongoose";
import Node from "../../../model/Node";

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

export async function verifyNode(nodeID : string, userID : string){
    if (!mongoose.Types.ObjectId.isValid(nodeID)) {
        throw new Error("Invalid node ID format");
    }
    const node = await Node.findById(nodeID); 
    if (!node){
        throw new Error("Node not found");
    }
    const world = await World.findById(node.worldID);
    if (!world.owners.includes(userID)){
        throw new Error("You are not the owner of this world");
    }
    return node;
}