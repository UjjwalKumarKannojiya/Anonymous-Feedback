import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import {z} from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";

export async function POST(req: Request) {
    try{
        const { code, username } = await req.json();
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }
        const isCodeValid = user.verifycode === code
        const isCodeNotExpired = new Date(user.verifycodeexp) > new Date()
        if (isCodeValid && isCodeNotExpired) {
            user.isverified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Verification successful",
            }, { status: 200 });
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired",
            }, { status: 400 });
        } else {
            return Response.json({
                success: false,
                message: "Verification code is incorrect",
            }, { status: 400 });
        }

    } catch (error) {
        console.error("Error verifying code", error);
        return Response.json({
            success: false,
            message: "An error occurred while verifying the code",
        }, { status: 500 });
    }
}