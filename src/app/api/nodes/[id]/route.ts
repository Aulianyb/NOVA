import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "../../auth/session";
import { errorhandling, verifyNode} from "../../function";
import World from "../../../../../model/World";
import Node from "../../../../../model/Node"

export async function DELETE(req: NextRequest, {params} : {params : {id:string}}){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        const node = await verifyNode(id, userID);
        await World.findOneAndUpdate({_id : node.worldID}, { $pull: { nodes: id } }); 

        const deletedNode = await Node.findByIdAndDelete({'_id' : id});
         return NextResponse.json({ data : deletedNode, message : "Node Deleted!"}, { status: 200 });
    } catch(error){
        return errorhandling(error); 
    }
}

export async function PUT(req: NextRequest, {params} : {params : {id:string}}){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const { id } = await params;
        await verifyNode(id, userID);

        const editedNode = await Node.findByIdAndUpdate(id,
             {
                nodeName : data.nodeName,
                nodePicture : data.nodePicture,
                nodeDescription : data.nodeDescription,
                images : data.images,
                relationships : data.relationships,
                tags : data.tags,
                positionX : data.positionX,
                positionY : data.positionY,
             }, 
             {new : true}
        )
        return NextResponse.json({ data : editedNode, message : "Node Edited!"}, { status: 200 });
    } catch(error){
        return errorhandling(error);
    }
}