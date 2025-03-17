import { connectToMongoDB } from "@/app/lib/connect";
import { NextRequest, NextResponse } from "next/server";
import World from "../../../../../model/World";
import { getSession } from "../../auth/session";
import jwt from "jsonwebtoken";
import User from "../../../../../model/User";

function verifyUser(sessionToken : string) {
    const JWT_SECRET = process.env.JWT_SECRET;
    const decoded = jwt.verify(sessionToken, JWT_SECRET!) as jwt.JwtPayload & { id: string };
    const userID = decoded.id
    return userID;
}

export async function GET(req: NextRequest, {params} : { params : {id : string}}){
    try {
        await connectToMongoDB();
        const session = await getSession();
        if (!session){
            throw new Error("No session found");
        }
        const userID = verifyUser(session.token);
        console.log(userID)
        const world = await World.findById(params.id);
        if (!world){
            throw new Error("World not found");
        }
        if (!world.owners.includes(userID)){
            throw new Error("You are not the owner of this world");
        }
        return NextResponse.json({data : world, message : "World Found!"})
    } catch(error){
        console.log(error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }){
    try {
        await connectToMongoDB();
        const worldID = params.id;

        const session = await getSession();
        if (!session){
            throw new Error("No session found");
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(session.token, JWT_SECRET!) as jwt.JwtPayload & { id: string };
        const userID = decoded.id

        const world = await World.findById(worldID);
        if (!world){
            throw new Error("World not found");
        }
        if (!world.owners.includes(userID)){
            throw new Error("You are not the owner of this world");
        }
        
        await User.updateMany(
            { _id: { $in: world.owners } },
            { $pull: { ownedWorlds: worldID } }
        );

        const deletedWorld = await World.findByIdAndDelete({'_id' : worldID});
        return NextResponse.json({ data : deletedWorld, message : "World Deleted!"}, { status: 200 });

    } catch(error){
        console.log(error);
        if (error instanceof Error) {
            if (error.message === "No session found" || error.message === "You are not the owner of this world") {
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


export async function PUT(req: NextRequest, { params }: { params: { id: string } }){
    try {
        await connectToMongoDB();

        const data = await req.json();
        const worldID = await params.id;

        const session = await getSession();
        if (!session){
            throw new Error("No session found");
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(session.token, JWT_SECRET!) as jwt.JwtPayload & { id: string };
        const userID = decoded.id

        const world = await World.findById(worldID);
        if (!world){
            throw new Error("World not found");
        }
        if (!world.owners.includes(userID)){
            throw new Error("You are not the owner of this world");
        }

        const editedWorld = await World.findByIdAndUpdate(worldID,
            {worldName : data.worldName,
            worldDescription : data.worldDescription},
            {new: true}
        );

        return NextResponse.json({ data : editedWorld, message : "World Edited!"}, { status: 200 });
    } catch(error){
        console.log(error);
        if (error instanceof Error) {
            if (error.message === "No session found" || error.message === "You are not the owner of this world") {
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