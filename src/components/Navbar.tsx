'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';
import { LogOut, Shield } from 'lucide-react';

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-skeuo-ridge">
      <div className="container mx-auto px-4 md:px-8 h-[4.5rem] flex items-center justify-between">
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold font-heading flex items-center gap-2.5 hover:opacity-90 transition-opacity group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center p-1.5 glass-skeuo-icon shadow-[0_4px_14px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-300">
            <Shield className="text-primary-foreground h-full w-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
          </div>
          <span className="hidden sm:inline">Mystery <span className="text-secondary drop-shadow-[0_0_8px_rgba(83,221,252,0.4)]">Message</span></span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Verified User</span>
                <span className="text-sm font-medium">{user.username || user.email}</span>
              </div>
              <Button
                variant="ghost"
                onClick={() => signOut()}
                className="rounded-xl glass-skeuo-ghost hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 h-10 px-4 flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Log Out</span>
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="rounded-xl h-10 px-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold glass-skeuo-btn">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;