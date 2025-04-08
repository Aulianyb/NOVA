import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "../../auth/session";
import { errorhandling, verifyObject} from "../../function";
import World from "../../../../../model/World";
import Object from "../../../../../model/Object"

export async function DELETE(req: NextRequest, {params} : {params : {id:string}}){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        const object = await verifyObject(id, userID);
        await World.findOneAndUpdate({_id : object.worldID}, { $pull: { objects: id } }); 

        const deletedObject = await Object.findByIdAndDelete({'_id' : id});
         return NextResponse.json({ data : deletedObject, message : "Object Deleted!"}, { status: 200 });
    } catch(error){
        return errorhandling(error); 
    }
}

export async function PUT(req: NextRequest, {params} : {params : {id:string}}){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const { id } = await params;
        await verifyObject(id, userID);

        const editedObject = await Object.findByIdAndUpdate(id,
             {
                objectName : data.objectName,
                objectPicture : data.objectPicture,
                objectDescription : data.objectDescription,
                images : data.images,
                relationships : data.relationships,
                tags : data.tags,
                positionX : data.positionX,
                positionY : data.positionY,
             }, 
             {new : true}
        )
        return NextResponse.json({ data : editedObject, message : "Object Edited!"}, { status: 200 });
    } catch(error){
        return errorhandling(error);
    }
}