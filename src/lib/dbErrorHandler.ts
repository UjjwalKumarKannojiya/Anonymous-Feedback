import { NextResponse } from 'next/server';

/**
 * Handle database connection errors with user-friendly messages
 */
export function handleDatabaseError(error: unknown) {
    const typedError = error as Error;
    
    console.error('Database Error:', typedError.message);

    // Authentication errors
    if (
        typedError.message?.includes('authentication failed') ||
        typedError.message?.includes('auth')
    ) {
        return NextResponse.json(
            {
                success: false,
                message: 'Database authentication failed. Please contact support.',
                code: 'DB_AUTH_ERROR',
            },
            { status: 503 }
        );
    }

    // Connection errors
    if (
        typedError.message?.includes('ECONNREFUSED') ||
        typedError.message?.includes('ENOTFOUND')
    ) {
        return NextResponse.json(
            {
                success: false,
                message: 'Database connection error. Please try again later.',
                code: 'DB_CONNECTION_ERROR',
            },
            { status: 503 }
        );
    }

    // Generic database error
    return NextResponse.json(
        {
            success: false,
            message: 'A database error occurred. Please try again.',
            code: 'DB_ERROR',
        },
        { status: 500 }
    );
}

/**
 * Wrap API route handlers to catch database errors
 */
export function withDatabaseErrorHandler(
    handler: (request: Request) => Promise<Response>
) {
    return async (request: Request): Promise<Response> => {
        try {
            return await handler(request);
        } catch (error) {
            return handleDatabaseError(error);
        }
    };
}
