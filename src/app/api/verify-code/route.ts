import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { code, username } = await req.json();
        const decodedUsername = decodeURIComponent(username);
        
        // Find user by username (case-insensitive search to handle URL variations)
        const user = await UserModel.findOne({
            username: { $regex: new RegExp(`^${decodedUsername}$`, "i") }
        });

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 404 });
        }

        // Developer Mode: Master Bypass Code
        const isMasterCode = process.env.NODE_ENV === 'development' && code === '000000';
        
        // Check if the code is correct and not expired
        const isCodeValid = user.verifyCode === code || isMasterCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Verification successful. You can now log in.",
            }, { status: 200 });
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired. Please sign up again to get a new code.",
            }, { status: 400 });
        } else {
            return Response.json({
                success: false,
                message: "Verification code is incorrect",
            }, { status: 400 });
        }

    } catch (error) {
        const typedError = error as Error;
        console.error("Error verifying code:", typedError.message);
        
        // Check if it's a database connection error
        if (
            typedError.message?.includes('authentication failed') ||
            typedError.message?.includes('ECONNREFUSED') ||
            typedError.message?.includes('ENOTFOUND')
        ) {
            return Response.json({
                success: false,
                message: "Service temporarily unavailable. Please try again later.",
            }, { status: 503 });
        }
        
        return Response.json({
            success: false,
            message: "An error occurred while verifying the code",
        }, { status: 500 });
    }
}