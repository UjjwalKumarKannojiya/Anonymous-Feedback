import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameQuerySchema.safeParse(queryParam);
    
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username",
          errors: usernameErrors,
        },
        { status: 400 }
      );
    }
    
    const { username } = result.data;

    // Check if ANY user exists with this username
    // Since the database enforces unique: true, we must consider both verified and unverified as "taken"
    const existingUser = await UserModel.findOne({ username });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    const typedError = error as Error;
    console.error("Error checking username:", typedError.message);
    
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
        message: "An error occurred while checking username uniqueness",
      },
      { status: 500 }
    );
  }
}
