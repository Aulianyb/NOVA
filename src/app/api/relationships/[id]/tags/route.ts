import { NextRequest, NextResponse } from "next/server";
import Tag from "../../../../../../model/Tag";
import { errorHandling, verifyUser, verifyRelationship } from "@/app/api/function";
import Relationship from "../../../../../../model/Relationship";

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
){
    try {
        const { id } = await params;
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const relationship = await verifyRelationship(id);
        if (!relationship) {
            throw new Error("Relationship not Found"); 
        }
        const relationshipTags = await Tag.find({_id : {$in : relationship.tags}})
        return NextResponse.json({
            data : relationshipTags,
            message : "Tags Fetched!"
        }, {status : 200})
    } catch(error){
        return errorHandling(error);
    }
}

export async function POST(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
){
    try {
        const { id } = await params;
        const data = await req.json(); 
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        await verifyRelationship(id);
        await Relationship.updateOne({_id : id}, {$push : {tags : data.tagID}})
        const result = await Tag.updateOne({_id : data.tagID}, {$push : {tagRelationships : id}})
        return NextResponse.json({data : result, message : "Tag has been added to relationship!"}, {status : 200})
    } catch(error){
        return errorHandling(error);
    }
}