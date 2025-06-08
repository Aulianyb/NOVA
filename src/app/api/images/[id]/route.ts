import { NextResponse, NextRequest } from "next/server";
import { verifyUser, errorHandling, verifyObject } from "../../function";
import Image from "@model/Image";
import Object from "@model/Object";

export async function PATCH(
        req: NextRequest, 
        { params }: { params: Promise<{ id: string, imageID : string }> }
){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        const data = await req.json();

        let changedImage;
        let message;

        if (data.imageTitle !== undefined) { 
            changedImage = await Image.updateOne({'_id' : id}, {imageTitle : data.imageTitle});
            message = "Updated image title!"
        }
        else if (data.addedObject !== undefined) { 
            const addedObject = data.addedObject
            await verifyObject(addedObject);
            changedImage = await Image.updateOne({'_id' : id}, {$push : {objects : addedObject}});
            await Object.updateOne({'_id' : addedObject}, {$push : {images : id}});
            message = "Added object to image!" 
        }
        return NextResponse.json({data : changedImage, message : message}, {status : 200});
    } catch (error){
        return errorHandling(error);
    }
}