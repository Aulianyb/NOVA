import { NextRequest, NextResponse } from "next/server";
import World from "@model/World"
import Object from "@model/Object"
import Relationship from "@model/Relationship";
import Tag from "@model/Tag"
import { errorHandling } from "@/app/api/function";
import { verifyWorld, verifyUser } from "@/app/api/function";
import User from "@model/User";

// NOTE : tolong tambahkan verifyWorld udah ini

export async function DELETE(
    req: NextRequest, { params }: { params: Promise<{ id: string, tagID : string }> }
){
    try {
        const {id} = await params; 
        const {tagID} = await params;
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        await verifyWorld(id, userID);
        const deletedTag = await Tag.findById(tagID);
        await World.updateMany({_id : id}, {$pull : {tags : tagID}});
        await Relationship.updateMany({_id : {$in : deletedTag.tagRelationships}}, {$pull : {tags : tagID}})
        await Relationship.updateMany({ _id: { $in: deletedTag.tagRelationships }, mainTag: tagID }, {mainTag : undefined});  
        await Object.updateMany({_id : {$in : deletedTag.tagObjects}}, {$pull : {tags : tagID}});
        const res = await Tag.findByIdAndDelete(tagID); 

        const currentUser = await User.findById(userID);
        const newChange = {
            description : "Deleted '" + deletedTag.tagName + "' tag",
            username : currentUser.username,
        }
        await World.updateOne({_id: id}, { $push: { changes : newChange} });
        return NextResponse.json({data : res, message : "Tag has been deleted"}, {status : 200})
    } catch(error){
        return errorHandling(error); 
    }
}

export async function PATCH(
    req: NextRequest, { params }: { params: Promise<{ id: string, tagID : string }> }
){
    try {
        const {id} = await params;
        const {tagID} = await params;

        const data = await req.json();
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        await verifyWorld(id, userID);
        
        const oldTag = await Tag.findById(tagID);
        let description : string[] = [];
        description = [] // biar ESlint gak marah aja
        const updateFields: { tagName?: string; tagColor?: string } = {};
        if (data.tagName !== undefined) { 
            updateFields.tagName = data.tagName;
            description.push("Changed '" + oldTag.tagName + "' tag into " + data.tagName);
        }
        if (data.tagColor !== undefined) { 
            updateFields.tagColor = data.tagColor;
            description.push("Changed " + oldTag.tagName + " color to " + data.tagColor);
        }
        const editedTag = await Tag.findByIdAndUpdate(tagID, updateFields, { new: true });
        if (!editedTag) {
            throw new Error("Tag is not found"); 
        }
        const currentUser = await User.findById(userID);
        const newChange = {
            description : description,
            username : currentUser.username,
        }
        await World.updateOne({_id: id}, { $push: { changes : newChange} });
        return NextResponse.json({data : editedTag, message : "Tag Edited"}, {status : 200})
    } catch(error){
        return errorHandling(error);
    }
}