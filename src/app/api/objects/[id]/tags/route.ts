import { NextRequest, NextResponse } from "next/server";
import Tag from "../../../../../../model/Tag";
import { errorHandling, verifyUser, verifyObject } from "@/app/api/function";
import Object from "../../../../../../model/Object";

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
        const object = await verifyObject(id);
        if (!object) {
            throw new Error("Object not Found"); 
        }
        const objectTags = await Tag.find({_id : {$in : object.tags}})
        return NextResponse.json({
            data : objectTags,
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
        await verifyObject(id);
        await Object.updateOne({_id : id}, {$push : {tags : data.tagID}})
        const result = await Tag.updateOne({_id : data.tagID}, {$push : {tagObjects : id}})
        return NextResponse.json({data : result, message : "Tag has been added to object!"}, {status : 200})
    } catch(error){
        return errorHandling(error);
    }
}