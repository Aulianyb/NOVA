import { NextRequest, NextResponse } from "next/server";
import World from "@model/World"
import Object from "@model/Object"
import Relationship from "@model/Relationship";
import Tag from "@model/Tag"
import { errorHandling } from "@/app/api/function";

export async function DELETE(
    req: NextRequest, { params }: { params: Promise<{ id: string, tagID : string }> }
){
    try {
        const {id} = await params; 
        const {tagID} = await params;
        const deletedTag = await Tag.findById(tagID);
        await World.updateMany({_id : id}, {$pull : {tags : tagID}});
        await Relationship.updateMany({_id : {$in : deletedTag.tagRelationships}}, {$pull : {tags : tagID}})
        await Object.updateMany({_id : {$in : deletedTag.tagObjects}}, {$pull : {tags : tagID}})
        const res = await Tag.findByIdAndDelete(tagID); 
        return NextResponse.json({data : res, message : "Tag has been deleted"}, {status : 200})
    } catch(error){
        return errorHandling(error); 
    }
}