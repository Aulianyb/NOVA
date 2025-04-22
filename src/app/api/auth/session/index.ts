'use server'; 

import { cookies } from "next/headers";
import { connectToMongoDB } from "@/app/lib/connect";
import jwt from "jsonwebtoken";

export type Session = {
    id : string,
    username: string,
    token: string; 
}; 

export const getSession = async (): Promise<Session | null> => {
    const cookieStore = await cookies(); 
    const session = cookieStore.get("session");
    if(session?.value){
        return JSON.parse(session.value) as Session;
    }
    return null; 
}; 


export const setSession = async (session: Session) => {
    const cookieStore = await cookies();
    cookieStore.set({
        name : 'session',
        value : JSON.stringify(session),
        httpOnly : true
    });
};
  
export const removeSession = async () => {
    const cookieStore = await cookies();
    cookieStore.delete('session');
};

export async function verifyUser() {
    await connectToMongoDB();
    const session = await getSession();
    if (!session){
        return null;
    } else{
        const JWT_SECRET = process.env.JWT_SECRET;
        const decoded = jwt.verify(session.token, JWT_SECRET!) as jwt.JwtPayload & { id: string };
        const userID = decoded.id
        return userID;
    }
}