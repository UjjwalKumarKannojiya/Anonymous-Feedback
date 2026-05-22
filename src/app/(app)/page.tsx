'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Lock } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
  const plugins = useMemo(
    () => [Autoplay({ delay: 3000, stopOnInteraction: false })],
    []
  );

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex flex-col">
      {/* Animated Background Glow Orbs */}
      <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[40%] right-[20%] w-[25%] h-[25%] bg-primary/10 rounded-full blur-[80px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="absolute inset-0 noise-texture pointer-events-none" />

      {/* Main content */}
      <main className="relative z-10 flex-grow flex flex-col items-center px-4 md:px-24 pt-32 pb-20 text-white">
        <section className="text-center mb-12 md:mb-16 max-w-3xl animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Secure Anonymous <br className="hidden sm:block" /> <span className="text-gradient drop-shadow-[0_0_30px_rgba(186,158,255,0.3)]">Feedback</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed opacity-80">
            Share your thoughts anonymously. A secure platform for honest communication where your identity is always protected.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="rounded-full px-10 py-6 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold glass-skeuo-btn text-base">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="rounded-full px-10 py-6 glass-skeuo-btn glass-skeuo-ghost text-base font-semibold">
                Log In
              </Button>
            </Link>
          </div>
        </section>

        {/* Carousel for Messages */}
        <section className="w-full max-w-5xl relative animate-slide-up stagger-2">
          <div className="absolute inset-0 bg-primary/5 rounded-[3rem] blur-3xl pointer-events-none animate-pulse-glow" />
          <Carousel
            opts={{ loop: true }}
            plugins={plugins}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4 md:basis-1/2 lg:basis-1/3">
                  <div className="glass-skeuo-card h-full flex flex-col justify-between animate-float-slow" style={{ animationDelay: `${index * 0.5}s` }}>
                    <div>
                      <div className="flex items-center gap-2 mb-4 text-secondary">
                        <div className="w-5 h-5 rounded-md glass-skeuo-icon flex items-center justify-center">
                          <Shield size={12} />
                        </div>
                        <span className="text-xs font-heading font-medium tracking-widest uppercase">Verified Secure</span>
                      </div>
                      <p className="text-lg mb-6 leading-relaxed">&quot;{message.content}&quot;</p>
                    </div>
                    <div className="glass-skeuo-groove mb-3" />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-40 shadow-[0_0_12px_rgba(186,158,255,0.3)]" />
                      <div>
                        <p className="text-xs font-semibold">{message.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{message.received}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Features Preview */}
        <section className="mt-24 grid md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            { icon: Shield, title: 'Privacy Protected', desc: 'Your identity is protected at all times. All messages are kept confidential.', color: 'text-primary', glow: 'rgba(186,158,255,0.15)' },
            { icon: Zap, title: 'Instant Messaging', desc: 'Send and receive messages instantly. Real-time communication with encryption.', color: 'text-secondary', glow: 'rgba(83,221,252,0.15)' },
            { icon: Lock, title: 'Secure & Encrypted', desc: 'End-to-end encryption ensures all messages are secure and protected.', color: 'text-primary', glow: 'rgba(186,158,255,0.15)' },
          ].map((feature, i) => (
            <div key={feature.title} className="glass-skeuo-card space-y-4 perspective-hover animate-slide-up" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
              <div className={`p-3.5 w-fit rounded-2xl glass-skeuo-icon ${feature.color}`} style={{ boxShadow: `0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 16px ${feature.glow}` }}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center p-8 glass-skeuo-ridge text-muted-foreground text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-primary transition-colors">Guidelines</Link>
        </div>
        <p>© 2024 Mystery Message. Secure Anonymous Communication.</p>
      </footer>
    </div>
  );
}