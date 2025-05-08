import { NextRequest, NextResponse } from "next/server";
import World from "../../../../../model/World";
import mongoose from "mongoose";
import { NodeJSON, EdgeJSON } from "../../../../../types/types";
import { verifyUser, verifyWorld, errorHandling } from "../../function";
import Object from "../../../../../model/Object";
import Relationship from "../../../../../model/Relationship";

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
        const worldID = data.worldID;
        const world = await verifyWorld(worldID, userID);
        const nodes = data.nodes;
        const edges = data.edges;
        const oldNodes = world.objects.map((objId:mongoose.Types.ObjectId) => objId.toString());
        const oldEdges = world.relationships.map((objId:mongoose.Types.ObjectId) => objId.toString());
        const newNodes = nodes.map((node:NodeJSON) => node.id.toString());
        const newEdges = edges.map((edge:EdgeJSON) => edge.id.toString());
        const deletedNodes = oldNodes.filter((id: string) => !newNodes.includes(id));
        const deletedEdges = oldEdges.filter((id:string) => !newEdges.includes(id));

        // NODE UPDATE
        const operations = await nodes.map((node: NodeJSON)=>({
            updateOne : {
                filter: { _id: node.id },
                update: {
                    $set : {
                        positionX : node.position.x,
                        positionY : node.position.y,
                        relationships : node.data.relationships
                    }
                }
            }
        }));
        const objectUpdateResult = await Object.bulkWrite(operations);
        
        // EDGE UPSERT
        const edgeOperations = await edges.map((edge: EdgeJSON)=>({
            updateOne : {
                filter: { _id: edge.id },
                update: {
                    source : edge.source,
                    target : edge.target,
                    relationshipDescription : edge.data.relationshipDescription,
                    tags : []
                },
                upsert: true
            }
        }));
        const edgeResult = await Relationship.bulkWrite(edgeOperations);
        
        await Promise.all(
            edges.map(async (edge : {
                id: string;
                source : string,
                target : string,
                data : {
                    relationshipDescription : string
                }
            }) => {
              await Object.updateMany(
                { _id: { $in: [edge.source, edge.target] } },
                { $addToSet: { relationships: edge.id } }
              );
            })
        );
        const createdEdges = (globalThis.Object).values(edgeResult.upsertedIds);
        await World.updateOne({_id: worldID}, { $push: { relationships : createdEdges } });

        // DELETE DELETED EDGES
        await Relationship.deleteMany({_id : {$in : deletedEdges}});
        await World.updateOne({_id: worldID}, { $pull: { relationship: { $in: deletedEdges } } });
        await Object.updateMany(
            { _id: { $nin: deletedNodes } },
            { $pull: { relationships: { $in: deletedEdges } } }
          );

        return NextResponse.json({ data : {
            nodes : objectUpdateResult,
            edges : edgeResult
        }, message : "Graph is saved!"}, { status: 200 });
    } catch(error){
        return errorHandling(error); 
    }
}