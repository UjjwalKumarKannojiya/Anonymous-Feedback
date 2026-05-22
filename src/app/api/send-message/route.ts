import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as Message);
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    const typedError = error as Error;
    console.error("Error sending message:", typedError.message);
    
    // Check if it's a database connection error
    if (
      typedError.message?.includes('authentication failed') ||
      typedError.message?.includes('ECONNREFUSED') ||
      typedError.message?.includes('ENOTFOUND')
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Service temporarily unavailable. Please try again later.",
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}