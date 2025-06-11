import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyUser, verifyWorld } from "../function";
import User from "@model/User";
import World from "@model/World";
import { Notification } from "@shared/types";

export async function GET(){
    try{
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const currentUser = await User.findById(userID)
        .populate("notifications.worldID", "worldName")
        .populate("notifications.sender", "username");  
        return NextResponse.json({data : currentUser.notifications, message : "Notifications retrieved!"}, {status : 200});
    } catch(error){
        return errorHandling(error);
    }
}

export async function POST(req : NextRequest){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const worldID = data.worldID;
        await verifyWorld(worldID, userID);
        const receiverName = data.receiver; 
        const receiver = await User.findOne({username : receiverName});
        if (!receiver){
            throw new Error("Username not found!");
        }
        const receiverID = receiver._id.toString();


        const world = await World.findById(worldID);
        if (world.collaborators.includes(receiverID)){
            throw new Error("Receiver is already a collaborator on this world!");
        }

        const user = await User.findById(receiverID);
        console.log(user.notifications)
        const existingNotifs = user.notifications.some((notif : Notification) =>
            notif.worldID.toString() === worldID &&
            notif.sender.toString() === userID &&
            notif.status === "pending"
        );

        console.log(existingNotifs)

        if (existingNotifs) {
            throw new Error('Already sent an invite for this user!')
        }


        const newNotif = {
            sender : userID,
            worldID : data.worldID,
        }
        const res = await User.updateOne({_id : receiverID}, {$push : {notifications : newNotif}});
        return NextResponse.json({data : res, message : "Notification Sent!"}, {status : 200});
    } catch (error){
        return errorHandling(error);
    }
}