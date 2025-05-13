import { NextRequest, NextResponse } from "next/server";
import World from "../../../../../model/World";
import User from "../../../../../model/User";
import { errorHandling, verifyWorld, verifyUser} from "../../function";
import Object from "../../../../../model/Object";
import Relationship from "../../../../../model/Relationship";
import cloudinary from "@/app/lib/connect";
import { verifyObject } from "../../function";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        const world = await verifyWorld(id, userID); 
        return NextResponse.json({data : world, message : "World Found!"})
    } catch(error){
        return errorHandling(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        const world = await verifyWorld(id, userID); 
        
        await User.updateMany(
            { _id: { $in: world.owners } },
            { $pull: { ownedWorlds: id } }
        );
                
        await User.updateMany(
            { _id: { $in: world.collaborators } },
            { $pull: { ownedWorlds: id } }
        );

        // Note to self : after Image is added : 
        // Don't forget to cascade images that is connected to said object.
        // Delete every images

        if (world.worldCover && world.worldCover != "worldCover/gn9gyt4gxzebqb6icrwj"){
            await cloudinary.uploader.destroy(world.worldCover);
        }

        const deletablePublicIDs: string[] = [];
        for (const objectID of world.objects){
            const object = await verifyObject(objectID);
            if (
                object.objectPicture &&
                object.objectPicture !== "objectPicture/fuetkmzyox2su7tfkib3"
              ) {
                deletablePublicIDs.push(object.objectPicture);
              }
        }

        if (deletablePublicIDs.length > 0) {
            await cloudinary.api.delete_resources(deletablePublicIDs);
        }
        await Object.deleteMany({_id : {$in : world.objects}});
        await Relationship.deleteMany({_id : {$in : world.relationships}});

        const deletedWorld = await World.findByIdAndDelete({'_id' : id});
        return NextResponse.json({ data : deletedWorld, message : "World Deleted!"}, { status: 200 });

    } catch(error){
        return errorHandling(error);
    }
}


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const { id } = await params;

        await verifyWorld(id, userID); 

        const editedWorld = await World.findByIdAndUpdate(id,
            {worldName : data.worldName,
            worldDescription : data.worldDescription},
            {new: true}
        );

        return NextResponse.json({ data : editedWorld, message : "World Edited!"}, { status: 200 });
    } catch(error){
        return errorHandling(error);
    }
}