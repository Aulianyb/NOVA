import { NextResponse } from "next/server";
import { getSession, removeSession } from "../session";
import { connectToMongoDB } from '@/app/lib/connect';
import { errorHandling } from "../../function";

export async function POST(){
    try {
        await connectToMongoDB();
        const session = await getSession(); 
        if (!session) {
            throw(new Error('No session found')); 
        }
        await removeSession();
        return NextResponse.json({message : "Logout successful"}, {status: 200});
    } catch (error){
        return errorHandling(error); 
    }
};