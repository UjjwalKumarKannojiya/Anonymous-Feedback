import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();

        // Check if username is already taken by a verified user
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken",
            }, { status: 400 });
        }

        // Check if email is already taken
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email",
                }, { status: 400 });
            } else {
                // Email exists but not verified - Update the existing user record
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.username = username;
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour
                await existingUserByEmail.save();
            }
        } else {
            // New user registration
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            await newUser.save();
        }

        // Dev Mode: Log the code (makes testing easier)
        console.log(`[DEV MODE] Verification Code for ${username}: ${verifyCode}`);

        // Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        // In development, we don't block registration if email fails (e.g. Resend domain issues)
        const isDev = process.env.NODE_ENV === 'development';
        
        if (!emailResponse.success) {
            if (isDev) {
                console.warn(`[DEV MODE] Email failed but proceeding: ${emailResponse.message}`);
                return Response.json({
                    success: true,
                    message: "User registered successfully. Please verify your email.",
                    verifyCode: verifyCode, // Provide code directly to UI in dev mode
                }, { status: 201 });
            }
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, { status: 500 });
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            verifyCode: isDev ? verifyCode : undefined, // Provide code to UI only in dev mode
        }, { status: 201 });

    } catch (error) {
        console.error("Error registering user:", error);
        return Response.json({
            success: false,
            message: "Error registering user",
        }, { status: 500 });
    }
}