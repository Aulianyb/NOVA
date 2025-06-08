import { NextRequest, NextResponse } from "next/server";
import Image from '@model/Image'
import Object from "@model/Object";
import cloudinary from "@/app/lib/connect";
import { errorHandling, verifyObject, verifyUser} from "@/app/api/function";

export async function DELETE(
    req: NextRequest, 
        { params }: { params: Promise<{ id: string, imageID : string }> }
){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        await verifyObject(id);
        const { imageID } = await params;
        const toBeDeletedImage = await Image.findById(imageID); 
        if (!toBeDeletedImage){
            throw Error("Image Not Found"); 
        }
        let message : string;
        const deletedImage = await Object.updateOne({"_id" : id}, {$pull : {images : imageID}})
        await Image.updateOne({"_id" : imageID}, {$pull : {objects : id}})
        if (toBeDeletedImage.objects.length == 1 && toBeDeletedImage.objects[0] == id){
            await cloudinary.uploader.destroy(toBeDeletedImage.imageID);
            await Image.findByIdAndDelete({'_id' : imageID});
            message = "Image is taken from the object and deleted from database!"
        } else{
            message = "Image is taken from the object!"
        }
        return NextResponse.json({ data : deletedImage, message : message}, {status : 200});
    } catch(error) {
        return errorHandling(error);
    }
}



