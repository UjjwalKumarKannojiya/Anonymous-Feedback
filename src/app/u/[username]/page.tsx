'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import Link from 'next/link';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What is your feedback on our service?||How can we improve our collaboration?||What's one thing you appreciate about our work?";

export default function UserProfile() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isLoading, setIsLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(
    parseStringMessages(initialMessageString)
  );
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success('Message Sent', {
        description: 'Your message has been safely delivered.',
      });
      form.reset({ content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to send your message'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post('/api/suggest-messages');
      const messages = response.data.message;
      if (messages) {
        setSuggestedMessages(parseStringMessages(messages));
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Fallback: stay with current messages or reset to initial
      toast.error('Could not get new suggestions, using defaults.');
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden pb-12 pt-32 px-4">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-[-10%] right-[10%] w-[50%] h-[50%] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-2xl w-full space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary mb-4">
            <Shield size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Transmission</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-heading">
            Send Message to <span className="text-gradient">@{username}</span>
          </h1>
          <p className="text-muted-foreground">
            Your message will be sent anonymously to the recipient.
          </p>
        </header>

        <section className="glass-skeuo-card p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest font-bold opacity-70 mb-3 block">Message Content</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Write your anonymous message here..."
                        className="flex min-h-[160px] w-full rounded-2xl glass-skeuo-inset px-4 py-4 text-base focus:outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button 
                  type="submit" 
                  disabled={isLoading || !messageContent}
                  className="rounded-xl px-12 py-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold glass-skeuo-btn neon-glow flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col items-center justify-center gap-4 px-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles size={18} className="text-secondary" />
              <h2 className="text-sm font-heading font-bold uppercase tracking-widest">Get Suggestions</h2>
            </div>
            <Button
              variant="ghost"
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="text-xs uppercase tracking-widest font-bold glass-skeuo-btn glass-skeuo-ghost h-auto py-2"
            >
              {isSuggestLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Suggestions"}
            </Button>
          </div>

          <div className="grid gap-3">
            {isSuggestLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
              </div>
            ) : (
              suggestedMessages.map((message, index) => (
                <button
                  key={index}
                  onClick={() => handleMessageClick(message)}
                  className="w-full text-center p-4 rounded-2xl glass-skeuo-btn glass-skeuo-ghost transition-all text-sm leading-relaxed group"
                >
                  <span className="opacity-70 group-hover:opacity-100 transition-opacity">&quot;{message}&quot;</span>
                </button>
              ))
            )}
          </div>
        </section>

        <footer className="pt-12 border-t border-white/5 text-center space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Want to receive anonymous feedback?</p>
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">Create your own profile to start receiving messages.</p>
          </div>
          <Link href="/sign-up">
            <Button variant="outline" className="rounded-xl px-8 glass-skeuo-btn glass-skeuo-ghost border-white/10">
              Create Account
            </Button>
          </Link>
        </footer>
      </div>
    </div>
  );
}
