import { NextRequest, NextResponse } from "next/server";
import Relationship from "../../../../../model/Relationship";
import { errorHandling } from "../../function";
import { verifyRelationship, verifyUser } from "../../function";

export async function PUT(req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const { id } = await params;
        await verifyRelationship(id);
        const editedObject = await Relationship.findByIdAndUpdate(id,
             {
                relationshipDescription : data.relationshipDescription
             }, 
             {new : true}
        )
        return NextResponse.json({ data : editedObject, message : "Relationship Edited!"}, { status: 200 });
    } catch(error){
        return errorHandling(error);
    }
}