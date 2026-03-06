import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "@/components/Providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediCare AI - Professional Healthcare Intelligence",
  description: "AI-powered medical consultation and report analysis platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased bg-white text-slate-900 min-h-screen selection:bg-blue-100 selection:text-blue-900`}>
        {/* Subtle gradient background - optimized with CSS */}
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-white to-cyan-50/30 z-[-1] pointer-events-none" />
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
