import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import { Message } from "@/src/model/User";
import { success } from "zod";
import { ca } from "zod/locales";
export async function POST(request: Request) {
    await dbConnect()
    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404}
        )
    } 
    if (!user.isAccptingMessages) {
        return Response.json({
            success: false,
            message: "User is not accepting messages"
        }, {status: 403})
    }
        const newMessage= {
        content,
        createdAt: new Date()}
        user.messages.push(newMessage as unknown as Message)
        await user.save()
        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, {status: 200})
} catch (error) {        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}