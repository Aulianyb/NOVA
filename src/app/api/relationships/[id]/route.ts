import { NextRequest, NextResponse } from "next/server";
import Relationship from "@model/Relationship";
import { errorHandling} from "../../function";
import { verifyRelationship, verifyUser } from "../../function";
import World from "@model/World";
import Object from "@model/Object";
import User from "@model/User";

export async function PATCH(req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const { id } = await params;
        const oldRelationship = await verifyRelationship(id);


        const description : string[] = []; 
        const currentUser = await User.findById(userID);
        const sourceNode = await Object.findById(oldRelationship.source);
        const updateFields: { relationshipDescription?: string; mainTag?: string } = {};
        const targetNode = await Object.findById(oldRelationship.target);

        // Handle description changes
        if (oldRelationship.relationshipDescription != data.relationshipDescription){
            updateFields.relationshipDescription = data.relationshipDescription;
            description.push("Changed description for the relationship between " + sourceNode.objectName + " and " + targetNode.objectName + " to '" + data.relationshipDescription + "'")
        }
        // Handle mainTag changes
        // Note : add whether the tag exists on not on the relationship
        if (!oldRelationship.mainTag || oldRelationship.mainTag != data.mainTag){
            description.push("Changed main tag of the relationship between " + sourceNode.objectName + " and " + targetNode.objectName + " to '" + data.relationshipDescription + "'")
            updateFields.mainTag = data.mainTag;
        }
        const editedRelationship = await Relationship.findByIdAndUpdate(id,updateFields, {new : true});
        const newChange = {
            description : description,
            username : currentUser.username,
        }
        const worldID = sourceNode.worldID;
        await World.updateOne({_id: worldID}, { $push: { changes : newChange} });
        return NextResponse.json({ data : editedRelationship, message : "Relationship Edited!"}, { status: 200 });
    } catch(error){
        return errorHandling(error);
    }
}

export async function DELETE(req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }){
        try {
            const userID = await verifyUser();
            if (!userID) {
                throw new Error("No Session Found"); 
            }
            const { id } = await params;
            const currentRelationship = await verifyRelationship(id);
            const sourceNode = await Object.findById(currentRelationship.source);
            const targetNode = await Object.findById(currentRelationship.target);
            const deletedRelationship = await Relationship.findByIdAndDelete({'_id' : id});

            await World.findByIdAndUpdate({_id : targetNode.worldID}, {$pull : {relationships : id}})      
            await Object.findByIdAndUpdate({_id: targetNode._id}, {$pull : {relationships : id}});
            await Object.findByIdAndUpdate({_id: sourceNode._id}, {$pull : {relationships : id} });
           
            const currentUser = await User.findById(userID);
            const newChange = {
                description : ["Deleted relationship between " + sourceNode.objectName + " and " + targetNode.objectName],
                username : currentUser.username,
            }
            await World.updateOne({_id: targetNode.worldID}, { $push: { changes : newChange} });
            return NextResponse.json({ data : deletedRelationship, message : "Relationship Deleted!"}, { status: 200 });
        } catch (error) {
            return errorHandling(error);
        }
}