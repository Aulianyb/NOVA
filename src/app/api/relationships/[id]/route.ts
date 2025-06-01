import { NextRequest, NextResponse } from "next/server";
import Relationship from "@model/Relationship";
import { errorHandling} from "../../function";
import { verifyRelationship, verifyUser } from "../../function";
import World from "@model/World";
import Object from "@model/Object";
import User from "@model/User";

export async function PUT(req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const { id } = await params;
        await verifyRelationship(id);
        const editedObject = await Relationship.findByIdAndUpdate(id,
             {
                relationshipDescription : data.relationshipDescription
             }, 
             {new : true}
        )
        const currentUser = await User.findById(userID);
        const sourceNode = await Object.findById(editedObject.source);
        const targetNode = await Object.findById(editedObject.target);
        const newChange = {
            description : ["Changed description for the relationship between " + sourceNode.objectName + " and " + targetNode.objectName + " to '" + data.relationshipDescription + "'"],
            username : currentUser.username,
        }
        const worldID = sourceNode.worldID;
        await World.updateOne({_id: worldID}, { $push: { changes : newChange} });
        return NextResponse.json({ data : editedObject, message : "Relationship Edited!"}, { status: 200 });
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