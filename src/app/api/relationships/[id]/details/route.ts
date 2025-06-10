import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyUser } from "@/app/api/function";
import Relationship from "@model/Relationship";

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
        const { sourceToTarget, targetToSource, story } = data;        
        const updatedRelationship = await Relationship.findByIdAndUpdate(
        id,
        {
            ...(targetToSource && { 'info.targetToSource': targetToSource }),
            ...(sourceToTarget && { 'info.sourceToTarget': sourceToTarget }),
            ...(story && { story }),
        },
        { new: true }
        );
        if (!updatedRelationship) {
            throw new Error("Relationship not found!");
        }
        return NextResponse.json({ data : updatedRelationship, message : "Relationship Detail Updated!"});
    } catch (error){
        return errorHandling(error);
    }
}