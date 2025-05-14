import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyObject, verifyUser, verifyWorld} from "../../function";
import World from "../../../../../model/World";
import Object from "../../../../../model/Object"
import cloudinary from "@/app/lib/connect";
import Relationship from "../../../../../model/Relationship";
import User from "../../../../../model/User";
import { UploadApiResponse } from "cloudinary";
import { RelationshipJSON } from "../../../../../types/types";

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
        const relationshipsToDelete = await Relationship.find({
            _id: { $in: deletedEdges },
          });
        const affectedNodeIds = new Set();
        relationshipsToDelete.forEach((rel : RelationshipJSON) =>{
            affectedNodeIds.add(rel.source.toString());
            affectedNodeIds.add(rel.target.toString());
        })
        await Object.updateMany({_id : {$in : Array.from(affectedNodeIds)}}, {$pull : {relationships : {$in : deletedEdges}}})
        await Relationship.deleteMany({_id : {$in : deletedEdges}});

        await World.findOneAndUpdate({_id : object.worldID}, { $pull: { objects:id } }); 
        const deletedObject = await Object.findByIdAndDelete({'_id' : id});

        const currentUser = await User.findById(userID);
        const newChange = {
            description : ["Deleted " + deletedObject.objectName],
            username : currentUser.username,
        }
        await World.updateOne({_id: object.worldID}, { $push: { changes : newChange} });

        return NextResponse.json({ data : deletedObject, message : "Object Deleted!"}, { status: 200 });
    } catch(error){
        return errorHandling(error); 
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
        const currentUser = await User.findById(userID);
        
        const formData = await req.formData();
        const { id } = await params;
        await verifyObject(id);
        const newObjectName = formData.get("objectName");
        const newObjectDescription = formData.get("objectDescription")
        const message : string[] = [];
        const oldData = await Object.findById(id);
        if (oldData.objectName != newObjectName) {
            message.push("Changed name of " + oldData.objectName + " into " + newObjectName);
        }
        if (oldData.objectDescription != newObjectDescription){
            message.push("Changed description of " + newObjectName + " into '" + newObjectDescription + "'");
        }
        let editedObject; 
        const objectPictureRaw = formData.get("objectPicture");
        if (objectPictureRaw instanceof File &&
            objectPictureRaw .size > 0
        ){
            const imageFile = formData.get("objectPicture") as File;
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const result : UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: "objectPicture" }, (error, result) => {
                    if (!result) return reject(new Error("No result returned from Cloudinary"));
                    if (error) return reject(error);
                    resolve(result);
                }).end(buffer);
                });
            const objectPictureID = result.public_id;
            message.push("Changed profile picture of " + newObjectName);
            editedObject = await Object.findByIdAndUpdate(id,
                {
                    objectName : newObjectName,
                    objectDescription : newObjectDescription,
                    objectPicture : objectPictureID
                }, 
                {new : true}
           )
        } else {
            editedObject = await Object.findByIdAndUpdate(id,
                {
                   objectName : newObjectName,
                   objectDescription : newObjectDescription,
                }, 
                {new : true}
           )
        }
        const newChange = {
            description : message,
            username : currentUser.username,
        }
        await World.updateOne({_id: oldData.worldID}, { $push: { changes : newChange} });
        return NextResponse.json({ data : editedObject, message : "Object Edited!"}, { status: 200 });
    } catch(error){
        return errorHandling(error);
    }
}