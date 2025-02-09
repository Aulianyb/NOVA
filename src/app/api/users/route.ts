import { NextRequest, NextResponse } from 'next/server';
import user from '../../../../model/User';

export async function POST(req: NextRequest){
    try {
        const data = await req.json();
        const newUser = new user({
            username: data.username,
            password: data.password,
            ownedWorlds: []
        });
        await newUser.save();
        return NextResponse.json({ done: true, user: newUser.username }, { status: 200 });
    } catch(error){
        console.log(error)
        return NextResponse.json({ error : error }, { status: 500 });
    }
}