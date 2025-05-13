import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyUser } from "../../function";
import User from "../../../../../model/User";
import World from "../../../../../model/World";

export async function PUT(
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

        if (newStatus == "accepted"){
            await User.updateOne({_id : userID}, {$push : {ownedWorlds : worldID}})
            await World.updateOne({_id : worldID}, {$push : {collaborators : userID}})
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