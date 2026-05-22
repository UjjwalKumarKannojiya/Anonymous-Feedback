import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user :User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            {$unwind: "$messages" },
            {$sort: { "messages.createdAt": -1 } },
            {$group: {_id: "$_id", messages: { $push: "$messages" } } }
        ])
        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })
    } catch (error) {
        const typedError = error as Error;
        console.error("Unexpected error fetching messages:", typedError.message);  
        
        // Check if it's a database connection error
        if (
            typedError.message?.includes('authentication failed') ||
            typedError.message?.includes('ECONNREFUSED') ||
            typedError.message?.includes('ENOTFOUND')
        ) {
            return Response.json({
                success: false,
                message: "Service temporarily unavailable. Please try again later."
            }, { status: 503 })
        }
        
        return Response.json({
            success: false,
            message: "Error fetching messages"
        }, { status: 500 })
    }
}