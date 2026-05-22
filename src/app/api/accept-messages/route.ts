import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    const userId = user._id;
    const {acceptMessage} = await req.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessage },
        { new: true }
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        }, { status: 200 })
    } catch (error) {
        const typedError = error as Error;
        console.error("Error in accept message POST:", typedError.message);
        
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
            message: "Internal Server Error"
        }, { status: 500 })
    }
}

export async function GET() {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 })
    }
    const userId = user._id;
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            isAcceptingMessages: foundUser.isAcceptingMessages
        }, { status: 200 })

    } catch (error) {
        const typedError = error as Error;
        console.error("Error getting acceptance status:", typedError.message);
        
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
            message: "Internal Server Error"
        }, { status: 500 })
    }
}
