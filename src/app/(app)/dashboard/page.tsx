'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Link as LinkIcon, Copy, Settings, Inbox } from 'lucide-react';
import { User } from 'next-auth';
import { toast } from 'sonner';

import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessage: true,
    },
  });

  const { watch, setValue } = form;
  const acceptMessage = watch('acceptMessage');

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => (message._id as unknown as string) !== messageId));
  };

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessage', response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to fetch message settings'
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success('Messages Refreshed', {
            description: 'Showing the latest messages in your inbox.',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ?? 'Failed to fetch messages'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessage: !acceptMessage,
      });
      setValue('acceptMessage', !acceptMessage);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to update message settings'
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  if (!session || !session.user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const { username } = session.user as User;
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl);
      toast.success('Link Copied', {
        description: 'Your profile link is ready to share.',
      });
    } else {
      // Fallback for insecure contexts (HTTP local network)
      const textArea = document.createElement("textarea");
      textArea.value = profileUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Link Copied', {
          description: 'Your profile link is ready to share.',
        });
      } catch (err) {
        console.error('Fallback copy failed:', err);
        toast.error('Unable to copy link automatically. Please copy it manually.');
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden pb-12 pt-28 md:pt-32 px-4">
      {/* Background Decorative Glow Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 noise-texture pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl w-full">
        <header className="mb-10 md:mb-12 space-y-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-heading tracking-tight">
            User <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Manage your anonymous feedback and account settings securely.
          </p>
        </header>

        <section className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* Identity Link Card */}
            <div className="glass-skeuo-card space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <LinkIcon size={18} />
                <h3 className="text-sm font-heading font-bold uppercase tracking-widest">Public Profile Link</h3>
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="w-full glass-skeuo-inset rounded-xl px-4 py-3 font-mono text-xs md:text-sm text-muted-foreground focus:outline-none truncate pr-12 md:pr-14"
                />
                <Button
                  onClick={copyToClipboard}
                  size="icon"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 md:h-9 md:w-9 rounded-lg glass-skeuo-btn text-white"
                >
                  <Copy size={16} />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed opacity-60">
                Share this link to allow anyone to send anonymous messages to your account.
              </p>
            </div>

            {/* Exposure Toggle Card */}
            <div className="glass-skeuo-card space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-secondary">
                  <Settings size={18} />
                  <h3 className="text-sm font-heading font-bold uppercase tracking-widest">Account Settings</h3>
                </div>
                <div className={`h-2 w-2 rounded-full transition-shadow ${acceptMessage ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-rose-500 opacity-50'}`} />
              </div>

              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl glass-skeuo-inset">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Accept Messages</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {acceptMessage ? 'Inbox is Open' : 'Inbox is Closed'}
                  </p>
                </div>
                <Switch
                  checked={acceptMessage}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="w-full rounded-2xl py-6 glass-skeuo-btn glass-skeuo-ghost border-white/10 transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <>
                  <RefreshCcw className="h-5 w-5" />
                  <span>Refresh Messages</span>
                </>
              )}
            </Button>
          </div>

          {/* Messages Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between gap-3 px-2 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                <Inbox size={18} />
                <h2 className="text-sm font-heading font-bold uppercase tracking-widest">Received Messages</h2>
              </div>
              <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-secondary uppercase tracking-widest">
                {messages.length} Messages
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-fit">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={message._id as unknown as string}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 glass-skeuo-card border-dashed bg-white/[0.01]">
                  <div className="p-6 rounded-full bg-white/5 text-muted-foreground/20 animate-pulse">
                    <Inbox size={64} strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-muted-foreground">Inboxes are Empty</p>
                    <p className="text-muted-foreground/60">You haven&apos;t received any messages yet. Share your link to get started!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
