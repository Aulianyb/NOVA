import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyUser } from "@/app/api/function";
import Object from "@model/Object";

export async function PATCH(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        const data = await req.json();
        const { bio, description, story } = data;        
        const updatedObject = await Object.findByIdAndUpdate(
        id,
        {
            ...(bio && { 'info.bio': bio }),
            ...(description && { 'info.description': description }),
            ...(story && { story }),
        },
        { new: true }
        );
        if (!updatedObject) {
            throw new Error("Object not found!");
        }
        return NextResponse.json({ data : updatedObject, message : "Object Detail Updated!"});
    } catch (error){
        return errorHandling(error);
    }
}