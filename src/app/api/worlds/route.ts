import { connectToMongoDB } from "@/app/lib/connect";
import { NextRequest, NextResponse } from "next/server";
import World from "../../../../model/World"; 
import User from "../../../../model/User"; 
import { getSession } from "../auth/session";
import jwt from 'jsonwebtoken'

export async function GET(){
    try {
        await connectToMongoDB();
        const session = await getSession();
        if (!session){
            throw new Error("No session found");
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(session.token, JWT_SECRET!) as jwt.JwtPayload & { id: string };
        const userID = decoded.id
        const user = await User.findById(userID); 

        const ownedWorlds = await World.find({ _id: { $in: user.ownedWorlds } })
        return NextResponse.json({ data : ownedWorlds, message : "World Fetched!"}, { status: 200 });
    } catch(error){
        console.log(error);
        if (error instanceof Error) {
            if (error.message === "No session found") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(
            { message : error },
            { status: 500 }
        );
    }
}

export async function POST(req:NextRequest){
    try {
        await connectToMongoDB();
        const data = await req.json();
        const session = await getSession();
        if (!session){
            throw new Error("No session found");
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(session.token, JWT_SECRET!) as jwt.JwtPayload & { id: string };
        const userID = decoded.id

        const newWorld = new World({
            worldName: data.worldName,
            worldDescription: data.worldDescription,
            owners: [userID],
            objects: [],
            changes: [],
            tags: []
        })
        
        const world = await newWorld.save();
        await User.updateOne({_id: userID}, { $push: { ownedWorlds: newWorld._id } });
        return NextResponse.json({ data : world, message : "New World Created!"}, { status: 200 });
    } catch(error){
        console.log(error);
        if (error instanceof Error) {
            if (error.message === "No session found") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json(
            { message : error },
            { status: 500 }
        );
    }
}