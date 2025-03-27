import { connectToMongoDB } from "@/app/lib/connect";
import { NextRequest, NextResponse } from "next/server";
import World from "../../../../model/World"; 
import User from "../../../../model/User"; 
import { getSession } from "../auth/session";
import jwt from 'jsonwebtoken'

export async function POST(req:NextRequest){
    try {
        await connectToMongoDB();
        const data = await req.json();
    } catch(error){
        console.log("Ini masih test"); 
    }
}