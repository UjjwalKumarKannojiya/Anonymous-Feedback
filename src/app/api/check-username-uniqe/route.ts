import dbConnect from "@/src/lib/dbConnect";
import User from "@/src/model/User";
import {success, z} from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";
import { tr } from "zod/locales";
import UserModel from "@/src/model/User";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});
export async function POST(request: Request) { 

    await dbConnect();
    try {
        const {searchParams} = new URL(request.url)
        const queryParam ={
            username: searchParams.get("username")
        }  
        const result = UsernameQuerySchema.safeParse(queryParam)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: "Invalid username",
                errors: usernameErrors
            }, { status: 400 })
        }
        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) { 
            return Response.json({
                success: false,
                message: "Username is already taken by a verified user",
            }, { status: 409 })
        }
        return Response.json({
            success: true,
            message: "Username is available",
        }, { status: 200 })

      } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "An error occurred while checking username uniqueness",
        }, { status: 500
        })
    }
    }
