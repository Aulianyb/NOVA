import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyUser} from "../../function";
import User from "@model/User";
import World from "@model/World";

export async function PATCH(
    req:NextRequest,
    { params }: { params: Promise<{ id: string }> }
){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        const data = await req.json();
        const newStatus = data.status; 
        const user = await User.findById(userID);
        const notification = user.notifications.id(id);
        const worldID = notification.worldID;
        const world = await World.findById(worldID);

        if (!world) {
            throw new Error("World not found!");
        }

        if (newStatus == "accepted"){
            const isAlreadyCollaborator = world.collaborators.includes(userID);
            if (isAlreadyCollaborator) {
                throw new Error("User is already a collaborator of this world!");
            } else {
                await User.updateOne({_id : userID}, {$push : {ownedWorlds : worldID}})
                await World.updateOne({_id : worldID}, {$push : {collaborators : userID}})
            }
        }

        const res = await User.updateOne(
            { _id : userID, 'notifications._id' : id},
            {$set:{'notifications.$.status' : newStatus}}
        )
        return NextResponse.json({data : res, message : "Invitation " + newStatus}, {status : 200});
    } catch(error) {
        return errorHandling(error);
    }
}