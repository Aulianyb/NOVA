import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyUser, verifyObject } from "@/app/api/function";
import Object from "@model/Object";
import Tag from "@model/Tag";

export async function DELETE(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string, tagID : string }> }
){
    try {
        const { id } = await params;
        const { tagID } = await params;
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        await verifyObject(id);
        await Tag.updateOne({_id : tagID}, {$pull : {tagObjects : id}});
        const result = await Object.updateOne({_id : id}, {$pull : {tags : tagID}})
        return NextResponse.json({data : result, message : "Tag has been removed from Relationship!"}, {status : 200})
    } catch(error){
        return errorHandling(error);
    }
}