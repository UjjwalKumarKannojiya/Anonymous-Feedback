'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Lock, User } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        toast.error('Login Failed', {
          description: result.error === 'CredentialsSignin' 
            ? 'Incorrect username or password' 
            : result.error,
        });
      }

      if (result?.url) {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('SignIn error:', error);
      toast.error('An unexpected error occurred during sign-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#0a0a0a] overflow-hidden px-4 pt-20">
      {/* Animated Background Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 w-full max-w-md glass-skeuo-card noise-texture space-y-8 animate-tilt-in">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 font-heading">
            Sign <span className="text-gradient drop-shadow-[0_0_20px_rgba(186,158,255,0.3)]">In</span>
          </h1>
          <p className="text-muted-foreground">
            Sign in to manage your anonymous feedback.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold opacity-70">Email / Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Email or Username" 
                        {...field} 
                        className="pl-10 rounded-xl"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold opacity-70">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        className="pl-10 rounded-xl"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full rounded-xl py-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold glass-skeuo-btn text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            New here?{' '}
            <Link href="/sign-up" className="text-secondary hover:text-secondary/80 font-bold transition-colors drop-shadow-[0_0_8px_rgba(83,221,252,0.3)]">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
