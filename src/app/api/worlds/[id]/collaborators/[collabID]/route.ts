import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyUser } from "@/app/api/function";
import World from "../../../../../../../model/World";
import User from "../../../../../../../model/User";

export async function DELETE(
        req:NextRequest,
        { params }: { params: Promise<{ id: string, collabID : string}> }
){
    try {
        const paramsRes = await params;
        const worldID = paramsRes.id;
        const collabID = paramsRes.collabID;
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const collaborator = User.findById(collabID);
        if (!collaborator) {
            throw new Error("Collaborator Not Found"); 
        }
        await User.updateOne({_id : collabID}, {$pull : {ownedWorlds : worldID}})
        const res = await World.updateOne({_id : worldID}, {$pull : {collaborators : collabID}})
        
        const newNotif = {
            sender : userID,
            worldID : worldID,
            status : "kicked"
        }
        await User.updateOne({_id : collabID}, {$push : {notifications : newNotif}});
        return NextResponse.json({data : res, message : "Collaborator Deleted"}, {status : 200})
    } catch(error){
        return errorHandling(error);
    }
}