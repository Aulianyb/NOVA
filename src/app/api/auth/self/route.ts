import { NextResponse } from "next/server";
import { getSession } from "../session";
import { connectToMongoDB } from '@/app/lib/connect';

export async function GET(){
    await connectToMongoDB();   
    const session = await getSession(); 
    if (!session){
        return NextResponse.json({message : "No session found"}, {status: 401});
    } else {
        return NextResponse.json({message : "User Authenticated", session : session}, {status: 200}) 
    }
}