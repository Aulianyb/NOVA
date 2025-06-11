import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyUser, verifyWorld } from "@/app/api/function";
import Tag from "@model/Tag";
import World from "@model/World";
import User from "@model/User";

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
        const world = await verifyWorld(id, userID);
        if (!world) {
            throw new Error("World not Found"); 
        }
        const worldTags = await Tag.find({_id : {$in : world.tags}})
        return NextResponse.json({
            data : worldTags,
            message : "Tags Fetched!"
        }, {status : 200})
    } catch(error) {
        return errorHandling(error);
    }
}

export async function POST(
     req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
){
    try{
        const { id } = await params;
        const data = await req.json(); 
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const world = await verifyWorld(id, userID);
        if (!world) {
            throw new Error("World not Found"); 
        }

        const newTag = new Tag({
            tagName : data.tagName,
            tagColor : "zinc",
            tagObjects : [],
            tagRelationships : []
        })


        const tag = await newTag.save();
        await World.updateOne({_id : id}, {$push : {tags : tag._id}})

        const currentUser = await User.findById(userID);
        const newChange = {
            description : "Added '" + data.tagName + "' tag",
            username : currentUser.username,
        }
        await World.updateOne({_id: id}, { $push: { changes : newChange} });
        return NextResponse.json({data : tag, message : "Tag has been added!"}, {status : 200})
    } catch(error){
        return errorHandling(error);
    }
}