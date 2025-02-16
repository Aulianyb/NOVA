import { NextResponse } from "next/server";
import { getSession, removeSession } from "../session";
import { connectToMongoDB } from '@/app/lib/connect';

export async function POST(){
    await connectToMongoDB();
    const session = await getSession(); 
    if (!session) {
        return NextResponse.json({message : "No session found"}, {status: 401});
    }
    await removeSession();
    return NextResponse.json({message : "Logout successful"}, {status: 200});
};