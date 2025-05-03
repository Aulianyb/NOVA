import { NextRequest, NextResponse } from "next/server";
import World from "../../../../../model/World";
import User from "../../../../../model/User";
import { errorhandling, verifyWorld, verifyUser} from "../../function";
import Object from "../../../../../model/Object";
import Relationship from "../../../../../model/Relationship";
import cloudinary from "@/app/lib/connect";

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
        return errorhandling(error);
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

        // Note to self : after Image is added : 
        // Don't forget to cascade images that is connected to said object.
        // Delete every images

        if (world.worldCover && world.worldCover != "worldCover/gn9gyt4gxzebqb6icrwj"){
            await cloudinary.uploader.destroy(world.worldCover);
        }
        
        await Object.deleteMany({_id : {$in : world.objects}});
        await Relationship.deleteMany({_id : {$in : world.relationships}});

        const deletedWorld = await World.findByIdAndDelete({'_id' : id});
        return NextResponse.json({ data : deletedWorld, message : "World Deleted!"}, { status: 200 });

    } catch(error){
        return errorhandling(error);
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
        return errorhandling(error);
    }
}