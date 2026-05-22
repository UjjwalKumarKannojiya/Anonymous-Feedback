'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounceCallback } from 'usehooks-ts';
import { toast } from 'sonner';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail, Lock, UserCheck } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(
            `/api/check-username?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message || 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      } else {
        setUsernameMessage('');
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      
      if (response.data.verifyCode) {
        toast.success(response.data.message, {
          description: `Verification Code: ${response.data.verifyCode}`,
          duration: 10000,
        });
      } else {
        toast.success(response.data.message);
      }
      
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error('Error in sign-up', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast.error('Signup failed', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#0a0a0a] overflow-hidden px-4 pt-32 pb-12">
      {/* Animated Background Glow Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 w-full max-w-md glass-skeuo-card noise-texture space-y-8 animate-tilt-in">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 font-heading">
            Create <span className="text-gradient drop-shadow-[0_0_20px_rgba(186,158,255,0.3)]">Account</span>
          </h1>
          <p className="text-muted-foreground">
            Join the platform and start receiving anonymous feedback securely.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold opacity-70">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Choose your handle"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                        className="pl-10 rounded-xl"
                      />
                    </div>
                  </FormControl>
                  {isCheckingUsername && (
                    <div className="flex items-center gap-2 mt-1">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Checking availability...</span>
                    </div>
                  )}
                  {usernameMessage && (
                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 animate-in fade-in slide-in-from-top-1 duration-300 ${
                      usernameMessage.toLowerCase().includes('available') ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]'
                    }`}>
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs uppercase tracking-widest font-bold opacity-70">Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Enter your email address" 
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
                        placeholder="Enter a secure password"
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
              className="w-full rounded-xl py-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold glass-skeuo-btn text-base mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-secondary hover:text-secondary/80 font-bold transition-colors drop-shadow-[0_0_8px_rgba(83,221,252,0.3)]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
