import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "../auth/session";
import Object from "../../../../model/Object";
import World from "../../../../model/World"; 
import { errorhandling, verifyWorld } from "../function";
import Relationship from "../../../../model/Relationship";

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

        const worldObjects = await Object.find({ _id: { $in: world.objects } })
        const worldRelationships = await Relationship.find({ _id: { $in: world.relationships } })
        return NextResponse.json({ data : {
            worldObjects : worldObjects,
            worldRelationships : worldRelationships
        }, message : "Objects Fetched!"}, { status: 200 });
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

        // If you're wondering why im writing down comments, im not using AI. 
        // My head is just too messy so i write things down
        // There's the anti AI disclaimer for ya. 


        // Establishing variables
        const data = await req.json();
        const worldID = data.worldID;
        const world = await verifyWorld(worldID, userID);
        const nodes = data.nodes;
        const edges = data.edges;
        const oldNodes = world.objects.map((objId: any) => objId.toString());
        const oldEdges = world.relationships.map((objId: any) => objId.toString());
        const newNodes = nodes.map((node:any) => node.id.toString());
        const newEdges = edges.map((edge:any) => edge.id.toString());
        const deletedNodes = oldNodes.filter((id: string) => !newNodes.includes(id));
        const deletedEdges = oldEdges.filter((id:string) => !newEdges.includes(id));

        // NODE UPSERT
        const operations = await nodes.map((node: {
            id: string;
            data: {
                objectName: string;
                objectDescription: string;
                objectPicture: string;
                tags: string[];
                images: string[];
                relationships: string[];
            };
            position: {
                x: number;
                y: number;
            }
        })=>({
            updateOne : {
                filter: { _id: node.id },
                update: {
                    objectName : node.data.objectName,
                    objectDescription : node.data.objectDescription,
                    objectPicture : node.data.objectPicture,
                    positionX : node.position.x,
                    positionY : node.position.y,
                    tags : node.data.tags,
                    relationships : node.data.relationships,
                    images : node.data.images,
                    worldID : worldID,
                },
                upsert: true
            }
        }));
        const nodeResult = await Object.bulkWrite(operations);
        const createdObjects = (globalThis.Object).values(nodeResult.upsertedIds);
        await World.updateOne({_id: worldID}, { $push: { objects : createdObjects } });

        // EDGE UPSERT
        console.log(edges[0]);
        const edgeOperations = await edges.map((edge: {
            id: string;
            source : string,
            target : string,
            data : {
                relationshipDescription : string
            }
        })=>({
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

        // DELETE DELETED NODES
        await Object.deleteMany({_id : {$in : deletedNodes}});
        await World.updateOne({_id: worldID}, { $pull: { objects: { $in: deletedNodes } } });

        // DELETE DELETED EDGES
        await Relationship.deleteMany({_id : {$in : deletedEdges}});
        await World.updateOne({_id: worldID}, { $pull: { relationship: { $in: deletedEdges } } });
        await Object.updateMany(
            { _id: { $nin: deletedNodes } },
            { $pull: { relationships: { $in: deletedEdges } } }
          );

        return NextResponse.json({ data : {
            nodes : nodeResult,
            edges : edgeResult
        }, message : "Graph is saved!"}, { status: 200 });
    } catch(error){
        return errorhandling(error); 
    }
}