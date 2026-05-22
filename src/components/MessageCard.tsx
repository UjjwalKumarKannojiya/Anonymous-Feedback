'use client';

import React from 'react';
import axios, { AxiosError } from 'axios';
import { Lock, Trash2, Calendar } from 'lucide-react';
import { Message } from '@/model/User';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id as unknown as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ?? 'Failed to delete message'
      );
    }
  };

  return (
    <div className="glass-skeuo-card flex flex-col justify-between group h-full shimmer-highlight perspective-hover">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-secondary">
            <div className="w-5 h-5 rounded-md glass-skeuo-icon flex items-center justify-center">
              <Lock size={10} />
            </div>
            <span className="text-[10px] font-heading font-medium tracking-[0.2em] uppercase opacity-70">
              Message Received
            </span>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full glass-skeuo-ghost opacity-0 group-hover:opacity-100 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/20 hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.35),0_0_12px_rgba(239,68,68,0.18)]"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass-skeuo-card border-white/10 text-white rounded-3xl !p-8">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-heading text-2xl">Delete this message?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This message will be permanently deleted. This action cannot be reversed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl glass-skeuo-ghost text-white hover:bg-white/10">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="rounded-xl bg-red-500/90 hover:bg-red-500 text-white font-bold glass-skeuo-btn hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="text-lg text-white leading-relaxed mb-6 font-medium">
          &quot;{message.content}&quot;
        </p>
      </div>

      {/* Embossed groove divider */}
      <div className="glass-skeuo-groove mb-4" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-40 shadow-[0_0_12px_rgba(186,158,255,0.3)]" />
          <div className="space-y-0.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Calendar size={10} />
              {new Date(message.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              {new Date(message.createdAt).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_10px_rgba(83,221,252,0.8)] animate-pulse" />
      </div>
    </div>
  );
};

export default MessageCard;