import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyUser, verifyObject } from "@/app/api/function";
import Image from "@model/Image";

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        const object = await verifyObject(id);
        if (!object) {
            throw new Error("Object not Found"); 
        }
        const objectImages = await Image.find({_id : {$in : object.images}}).populate("objects", "objectName")
        return NextResponse.json({
            data : objectImages,
            message : "Images Fetched!"
        }, {status : 200})
    } catch(error){
        return errorHandling(error); 

    }
}