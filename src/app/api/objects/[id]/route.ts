import { NextRequest, NextResponse } from "next/server";
import { errorhandling, verifyObject, verifyUser, verifyWorld} from "../../function";
import World from "../../../../../model/World";
import Object from "../../../../../model/Object"
import cloudinary from "@/app/lib/connect";

export async function DELETE(
req: NextRequest, 
{ params }: { params: Promise<{ objectID: string }> }
){
    try {
        // Note to self : after Image is added : 
        // Don't forget to cascade images that is connected to said object.
        // Delete every images

        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { objectID } = await params;
        const object = await verifyObject(objectID);
        await verifyWorld(object.worldID, userID);
        if (object.objectPicture && object.objectPicture != "objectPicture/fuetkmzyox2su7tfkib3"){
            await cloudinary.uploader.destroy(object.objectPicture);
        }
        await World.findOneAndUpdate({_id : object.worldID}, { $pull: { objects:objectID } }); 
        const deletedObject = await Object.findByIdAndDelete({'_id' : objectID});
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