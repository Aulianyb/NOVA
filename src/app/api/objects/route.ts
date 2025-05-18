import { NextRequest, NextResponse } from "next/server";
import Object from "../../../../model/Object";
import { errorHandling, verifyWorld, verifyUser} from "../function";
import Relationship from "../../../../model/Relationship";
import cloudinary from "@/app/lib/connect";
import { UploadApiResponse } from "cloudinary";
import World from "../../../../model/World";
import User from "../../../../model/User";

export async function GET(req:NextRequest){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { searchParams } = new URL(req.url);
        const worldID = searchParams.get("worldID");
        if (!worldID){
            throw new Error("World ID is missing");
        }
        const world = await verifyWorld(worldID, userID);
        
        const worldObjects = await Object.find({ _id: { $in: world.objects } })
        const worldRelationships = await Relationship.find({ _id: { $in: world.relationships } })
        return NextResponse.json({ data : {
            worldObjects : worldObjects,
            worldRelationships : worldRelationships
        }, message : "Objects Fetched!"}, { status: 200 });
    } catch(error){
        return errorHandling(error);
    }
}

export async function POST(req:NextRequest){
    try {
        const formData = await req.formData();
        let objectPictureID = "objectPicture/fuetkmzyox2su7tfkib3";
        const objectPictureRaw = formData.get("objectPicture");
        const worldID = formData.get("worldID") as string;
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        if (!worldID){
            throw new Error("World ID is missing");
        }
        await verifyWorld(worldID, userID);

        console.log(objectPictureRaw);
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
            objectPictureID = result.public_id;
        }

        const newObject = new Object({
            objectName : formData.get("objectName"),
            objectDescription : formData.get("objectDescription"),
            objectPicture : objectPictureID,
            positionX : formData.get("positionX"),
            positionY : formData.get("positionY"),
            tags : [],
            relationships : [],
            images : [],
            worldID : worldID,
        })


        const object = await newObject.save();
        await World.updateOne({_id: worldID}, { $push: { objects : object.id } });
       
        const currentUser = await User.findById(userID);
        const newChange = {
            description : ["Added " + formData.get("objectName")],
            username : currentUser.username,
        }
        await World.updateOne({_id: worldID}, { $push: { changes : newChange} });
        return NextResponse.json({ data : object, message : "Node Added!"}, { status: 200 });
    } catch(error){
        return errorHandling(error); 
    }
}