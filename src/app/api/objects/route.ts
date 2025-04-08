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

        const nodes = data.nodes;
        nodes.forEach((node : any) => {
        });
        // const newObject = new Object({
        //     objectName : data.objectName,
        //     objectPicture : data.objectPicture,
        //     objectDescription : data.objectDescription,
        //     images : [],
        //     relationships : [],
        //     tags : [],
        //     positionX : data.positionX,
        //     positionY : data.positionY,
        //     worldID : worldID
        // });

        // const createdObject = await newObject.save();
        // await World.updateOne({_id: worldID}, { $push: { objects : newObject._id } });
        // return NextResponse.json({ data : createdObject, message : "New Object Created!"}, { status: 200 });

    } catch(error){
        return errorhandling(error); 
    }
}