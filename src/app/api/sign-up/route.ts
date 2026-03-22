import dbConnect from "@/src/lib/dbConnect";
import User from "@/src/model/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";
import { success } from "zod";
import UserModel from "@/src/model/User";
export async function POST(request: Request) {
    await dbConnect();
  try {
       const { username, email, password } = await request.json()
       const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isverified: true,
      })
        if (existingUserVerifiedByUsername) {
            return NextResponse.json({
                success: false,
                message: "Username already exists"
            }, {
                status: 400
            })
        }
        const existingUserVerifiedByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isverified) {
                return NextResponse.json({
                    success: false,
                    message: "User already exists"
                }, {
                    status: 400
                })
            }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifycode = verifyCode;
                existingUserVerifiedByEmail.verifycodeexp = new Date(Date.now() + 3600000)
                await existingUserVerifiedByEmail.save();
            }// 1 hour from now
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry time to 1 hour from now 
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifycode: verifyCode,
                verifycodeexp: expiryDate,
                isverified: false,
                isAccptingMessages: true,
                messages: []
            })
            await newUser.save()
            }
            const emailResponse = await sendVerificationEmail(email, username, verifyCode)
            if (emailResponse.success) {
                return Response.json({
                    success: false,
                    message: emailResponse.message
            },{status: 500})
            }
            return Response.json({
                success: true,
                 message: "User registered successfully. Please check your email for the verification."
            },{status: 201})

  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json({ 
        success: false,
        message: "Errror registering user."
     },
    {
    status: 500,
    });
  }}