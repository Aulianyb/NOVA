import { NextRequest, NextResponse } from "next/server";
import World from "../../../../model/World"; 
import User from "../../../../model/User"; 
import { errorHandling, verifyUser} from "../function";
import cloudinary from "@/app/lib/connect";
import { UploadApiResponse } from "cloudinary";

export async function GET(){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const user = await User.findById(userID); 
        const ownedWorlds = await World.find({ _id: { $in: user.ownedWorlds } })
        return NextResponse.json({ data : ownedWorlds, message : "World Fetched!"}, { status: 200 });
    } catch(error){
        return errorHandling(error);
    }
}

export async function POST(req:NextRequest){
    try {
        const formData = await req.formData();

        let worldCoverID = "worldCover/gn9gyt4gxzebqb6icrwj"; 

        const worldCoverRaw = formData.get("worldCover");
        if (worldCoverRaw instanceof File &&
            worldCoverRaw.size > 0
        ){
            const imageFile = formData.get("worldCover") as File;
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const result : UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: "worldCover" }, (error, result) => {
                    if (!result) return reject(new Error("No result returned from Cloudinary"));
                    if (error) return reject(error);
                  resolve(result);
                }).end(buffer);
              });
            worldCoverID = result.public_id;
        } 

        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }

        const newWorld = new World({
            worldName: formData.get("worldName"),
            worldDescription: formData.get("worldDescription"),
            worldCover : worldCoverID,
            owners: [userID],
            collaborators : [],
            objects: [],
            relationships: [],
            changes: [],
            tags: [],
        });
        
        const world = await newWorld.save();
        await User.updateOne({_id: userID}, { $push: { ownedWorlds: world._id } });
        return NextResponse.json({ data : world, message : "New World Created!"}, { status: 200 });
    } catch(error){
        return errorHandling(error);
    }
}