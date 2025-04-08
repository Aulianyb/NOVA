import { NextRequest, NextResponse } from "next/server";
import World from "../../../../model/World"; 
import User from "../../../../model/User"; 
import { verifyUser } from "../auth/session";
import { errorhandling } from "../function";

export async function GET(){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const user = await User.findById(userID); 

        const ownedWorlds = await World.find({ _id: { $in: user.ownedWorlds } })
        return NextResponse.json({ data : ownedWorlds, message : "World Fetched!"}, { status: 200 });
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
        const newWorld = new World({
            worldName: data.worldName,
            worldDescription: data.worldDescription,
            owners: [userID],
            objects: [],
            changes: [],
            tags: []
        });
        
        const world = await newWorld.save();
        await User.updateOne({_id: userID}, { $push: { ownedWorlds: newWorld._id } });
        return NextResponse.json({ data : world, message : "New World Created!"}, { status: 200 });
    } catch(error){
        return errorhandling(error);
    }
}