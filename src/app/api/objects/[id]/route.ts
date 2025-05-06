import { NextRequest, NextResponse } from "next/server";
import { errorhandling, verifyObject, verifyUser, verifyWorld} from "../../function";
import World from "../../../../../model/World";
import Object from "../../../../../model/Object"
import cloudinary from "@/app/lib/connect";
import Relationship from "../../../../../model/Relationship";
import User from "../../../../../model/User";

export async function DELETE(
req: NextRequest, 
{ params }: { params: Promise<{ id: string }> }
){
    try {
        // Note to self : after Image is added : 
        // Don't forget to cascade images that is connected to said object.
        // Delete every images

        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        const object = await verifyObject(id);
        await verifyWorld(object.worldID, userID);
        if (object.objectPicture && object.objectPicture != "objectPicture/fuetkmzyox2su7tfkib3"){
            await cloudinary.uploader.destroy(object.objectPicture);
        }
        const deletedEdges = object.relationships;
        await Relationship.deleteMany({_id : {$in : deletedEdges}});
        await World.findOneAndUpdate({_id : object.worldID}, { $pull: { objects:id } }); 
        const deletedObject = await Object.findByIdAndDelete({'_id' : id});

        const currentUser = await User.findById(userID);
        const newChange = {
            description : "Deleted " + deletedObject.objectName,
            username : currentUser.username,
        }
        await World.updateOne({_id: object.worldID}, { $push: { changes : newChange} });

        return NextResponse.json({ data : deletedObject, message : "Object Deleted!"}, { status: 200 });
    } catch(error){
        return errorhandling(error); 
    }
}

export async function PUT(
req: NextRequest, 
{ params }: { params: Promise<{ id: string }> })
{
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const { id } = await params;
        console.log(id);
        await verifyObject(id);

        const editedObject = await Object.findByIdAndUpdate(id,
             {
                objectName : data.objectName,
                objectPicture : data.objectPicture,
                objectDescription : data.objectDescription,
             }, 
             {new : true}
        )
        return NextResponse.json({ data : editedObject, message : "Object Edited!"}, { status: 200 });
    } catch(error){
        return errorhandling(error);
    }
}