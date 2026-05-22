import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Grotesk, Manrope } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-heading' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-body' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mystery Message — Secure Anonymous Feedback",
  description: "Mystery Message — Secure Anonymous Feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, spaceGrotesk.variable, manrope.variable)}>
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-body noise-overlay`}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
