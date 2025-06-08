import { UploadApiResponse } from "cloudinary";
import cloudinary from "@/app/lib/connect";
import Object from "@model/Object";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser, errorHandling } from "../function";
import Image from "@model/Image";

export async function POST(
    req: NextRequest
){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const formData = await req.formData();
        const imageRaw = formData.get("imageFile");
        if (imageRaw instanceof File &&
            imageRaw .size > 0
        ){
            const imageFile = formData.get("imageFile") as File;
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const result : UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: "galleryImage" }, (error, result) => {
                    if (!result) return reject(new Error("No result returned from Cloudinary"));
                    if (error) return reject(error);
                    resolve(result);
                }).end(buffer);
                });
            const imageID = result.public_id;
            const addedObjects = formData.getAll("objects");
            const newImage = new Image({
                imageID : imageID,
                imageTitle : formData.get("imageTitle"),
                objects : addedObjects
            })
            
            const savedImage = await newImage.save();
            await Object.updateMany({_id : {$in : addedObjects}}, {$push : {images : savedImage._id}})
            return NextResponse.json({ data : savedImage, message : "Image Added!"}, { status: 200 });
        } else {
            throw new Error("Must include image file!"); 
        }
    } catch (error){
        return errorHandling(error); 
    }
}