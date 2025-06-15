import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyUser } from "@/app/api/function";
import Object from "@model/Object";
import User from "@model/User";
import World from "@model/World";

export async function PATCH(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        const data = await req.json();
        const { bio, description, story } = data;      
        const updateFields: Record<string, any> = {};

        if (bio !== undefined) {
        updateFields['info.bio'] = bio;
        }
        if (description !== undefined) {
        updateFields['info.description'] = description;
        }
        if (story !== undefined) {
        updateFields.story = story;
        }
        
        const existingObject = await Object.findById(id);
        const updatedObject = await Object.findByIdAndUpdate(
        id,
        updateFields,
        { new: true }
        );
        if (!updatedObject) {
            throw new Error("Object not found!");
        }

        let changeDescription : string[] = [];
        changeDescription = [];
        if (bio && bio !== existingObject.info?.bio) {
            changeDescription.push("Changed basic information for " + existingObject.objectName)
        }
        if (description && description !== existingObject.info?.description) {
            changeDescription.push("Changed description for " + existingObject.objectName)
        }
        if (story && story !== existingObject.story) {
            changeDescription.push("Changed story for " + existingObject.objectName)
        }
        const currentUser = await User.findById(userID);
        const newChange = {
            description : changeDescription,
            username : currentUser.username,
        }
        await World.updateOne({_id: existingObject.worldID}, { $push: { changes : newChange} });
        return NextResponse.json({ data : updatedObject, message : "Object Detail Updated!"});
    } catch (error){
        return errorHandling(error);
    }
}