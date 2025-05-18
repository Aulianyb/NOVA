import { NextRequest, NextResponse } from "next/server";
import { errorHandling, verifyWorld, verifyUser } from "@/app/api/function";

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
    
){
    try{
        const { id } = await params;
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const world = await verifyWorld(id, userID);
        if (!world) {
            throw new Error("World not Found"); 
        }
        const changes = world.changes;

        return NextResponse.json({data : changes, message : "Changes fetched"}, {status : 200});
    } catch(error){
        return errorHandling(error);
    }
}