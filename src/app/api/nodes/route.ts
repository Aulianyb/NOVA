import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "../auth/session";
import Node from "../../../../model/Node";
import World from "../../../../model/World"; 
import { errorhandling, verifyWorld } from "../function";

export async function GET(req:NextRequest){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { searchParams } = new URL(req.url);
        const worldID = searchParams.get("worldID");
        if (!worldID){
            throw new Error("World ID is missing");
        }
        const world = await verifyWorld(worldID, userID);

        const worldNodes = await Node.find({ _id: { $in: world.nodes } })
        return NextResponse.json({ data : worldNodes, message : "Nodes Fetched!"}, { status: 200 });
    } catch(error){
        return errorhandling(error);
    }
}

export async function POST(req:NextRequest){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const data = await req.json();
        const worldID = data.worldID;
        await verifyWorld(worldID, userID);

        // UPSERT
        const nodes = data.nodes;


        const operations = await nodes.map((node: {
            id: string;
            data: {
                nodeName: string;
                nodeDescription: string;
                nodePicture: string;
            };
            position: {
                x: number;
                y: number;
            }
        })=>({
            updateOne : {
                filter: { _id: node.id },
                update: {
                    nodeName : node.data.nodeName,
                    nodeDescription : node.data.nodeDescription,
                    nodePicture : node.data.nodePicture
                },
                upsert: true
            }
        }));


        const result = await Node.bulkWrite(operations);
        // const newIds = Node.values(upsertedIds);

        // WORLD UPDATE WITH NEWEST ONE
        // const newNodes = Node.values(result.upsertedIds);
        
        // DELETE RELATIONSHIP YANG BERHUBUNGAN

        // DELETE IMAGES YANG OWNERNYA CUMA ITU AJA

        // FINALLY, DELETE NODES


        // const currentIds = nodes.map(n => n.id);
        // await collection.deleteMany({
        //     _id: { $nin: currentIds }
        // });
          

        // const newNode = new Node({
        //     nodeName : data.nodeName,
        //     nodePicture : data.nodePicture,
        //     nodeDescription : data.nodeDescription,
        //     images : [],
        //     relationships : [],
        //     tags : [],
        //     positionX : data.positionX,
        //     positionY : data.positionY,
        //     worldID : worldID
        // });

        // const createdNode = await newNode.save();
        // await World.updateOne({_id: worldID}, { $push: { nodes : newNode._id } });
        return NextResponse.json({ data : result, message : "New Node Created!"}, { status: 200 });
    } catch(error){
        return errorhandling(error); 
    }
}