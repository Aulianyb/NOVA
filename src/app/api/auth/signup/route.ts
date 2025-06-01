import { NextRequest, NextResponse } from 'next/server';
import User from '@model/User'
import * as bcrypt from 'bcrypt';
import { connectToMongoDB } from '@/app/lib/connect';
import jwt from 'jsonwebtoken'; 
import { Session, setSession } from '../session';
import { errorHandling } from '../../function';

export async function POST(req: NextRequest){
    try {
        await connectToMongoDB();
        const data = await req.json();
        // checking for unique username
        // Note : might remove this, check if mongoose already done this for me
        const existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const salt = await bcrypt.genSalt(11);
        data.password = await bcrypt.hash(data.password, salt);
        const newUser = new User({
            username: data.username,
            password: data.password,
            ownedWorlds: [],
            changes : []
        });
        const user = await newUser.save();
        console.log(user)
        // NOTE : Assumed that a user has been created, logged in right after
        const tokenData = {
            id : user._id,
            username : user.username
          }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error('JWT_SECRET not defined')
        const token = await jwt.sign(tokenData, JWT_SECRET!)
        const session : Session = {
        id : user._id,
        username : user.username,
        token : token
        }
        await setSession(session); 
        return NextResponse.json({ data : newUser, message : "New User Created!"}, { status: 200 });
    } catch(error){
        return errorHandling(error);
    }
}