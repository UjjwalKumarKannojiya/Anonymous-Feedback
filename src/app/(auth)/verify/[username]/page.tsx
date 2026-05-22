'use client'
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import axios from "axios";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const VerifyAccount = () => {
    const router = useRouter();
    const param = useParams<{ username: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        },
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/verify-code', {
                username: param.username,
                code: data.code,
            })
            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            console.error("Error verifying account:", error)
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message || "An unexpected error occurred. Please try again."
            toast.error("Verification Failed", {
                description: errorMessage,
            })
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-[#0a0a0a] overflow-hidden px-4 pt-32 pb-12 text-white">
            {/* Background Decorative Glow Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md glass-skeuo-card space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 font-heading">
                        Verify <span className="text-gradient">Account</span>
                    </h1>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Enter the 6-digit verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs uppercase tracking-widest font-bold opacity-70">6-Digit Code</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="XXXXXX" 
                                            {...field}
                                            className="glass-skeuo-inset rounded-xl text-center tracking-[0.5em] text-xl font-bold py-6 placeholder:opacity-20 shadow-[inset_0_4px_14px_rgba(0,0,0,0.65),inset_0_1px_2px_rgba(0,0,0,0.5),inset_0_-1px_0_rgba(255,255,255,0.05)]"
                                            maxLength={6}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl py-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold glass-skeuo-btn neon-glow flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                "Verify Account"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyAccount
