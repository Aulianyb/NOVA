import { NextRequest, NextResponse } from 'next/server';
import user from '../../../../../model/User';
import * as bcrypt from 'bcrypt';

export async function POST(req: NextRequest){
    try {
        const data = await req.json();

        // checking for unique username
        const existingUser = await user.findOne({ username: data.username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        // const bcrypt = require('bcrypt');
        const salt = await bcrypt.genSalt(11);
        data.password = await bcrypt.hash(data.password, salt);
        const newUser = new user({
            username: data.username,
            password: data.password,
            ownedWorlds: []
        });
        await newUser.save();
        return NextResponse.json({ data : newUser, message : "New User Created!"}, { status: 200 });
    } catch(error){
        console.log(error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}