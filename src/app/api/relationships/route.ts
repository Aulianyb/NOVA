import { NextRequest, NextResponse } from "next/server";
import { verifyUser, errorHandling, verifyWorld} from "../function";
import Relationship from "../../../../model/Relationship";
import Object from "../../../../model/Object";
import World from "../../../../model/World";

export async function POST(req:NextRequest){
    try{
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const worldID = data.worldID;
        await verifyWorld(worldID, userID);
        const sourceNode = await Object.findById(data.source);
        const targetNode = await Object.findById(data.target);
        if (!sourceNode || !targetNode){
            throw new Error("Target or Source node is invalid");
        }
        const newRelationship = new Relationship({
            source : data.source,
            target : data.target,
            relationshipDescription : data.relationshipDescription,
            tags : []
        }); 

        const res = await newRelationship.save();
        await World.updateOne({_id: worldID}, { $push: { relationships : res.id } });
        return NextResponse.json({data : res, message : "Relationship Added!"}, {status : 200})
    } catch(error){
        errorHandling(error); 
    }
}