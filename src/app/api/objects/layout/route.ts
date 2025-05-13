import { NextRequest, NextResponse } from "next/server";
import { NodeJSON} from "../../../../../types/types";
import { verifyUser, errorHandling } from "../../function";
import Object from "../../../../../model/Object";

export async function POST(req:NextRequest){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }

        // If you're wondering why im writing down comments, im not using AI. 
        // My head is just too messy so i write things down
        // There's the anti AI disclaimer for ya. 
        
        // Establishing variables
        const data = await req.json();
        const nodes = data.nodes;

        // NODE UPDATE
        const operations = await nodes.map((node: NodeJSON)=>({
            updateOne : {
                filter: { _id: node.id },
                update: {
                    $set : {
                        positionX : node.position.x,
                        positionY : node.position.y,
                    }
                }
            }
        }));
        const objectUpdateResult = await Object.bulkWrite(operations);

        return NextResponse.json({ data : {
            nodes : objectUpdateResult
        }, message : "Graph is saved!"}, { status: 200 });
    } catch(error){
        return errorHandling(error); 
    }
}