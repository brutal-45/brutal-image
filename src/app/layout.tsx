import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "BRUTALIMAGE - AI-Powered Image Editor",
  description: "Edit Photos. Brutally Perfect. Professional AI-powered image editing with background removal, color grading, layers, and smart retouch tools.",
  keywords: ["image editor", "photo editing", "AI", "background remover", "color grading", "BRUTALIMAGE", "brutal design"],
  authors: [{ name: "BRUTALIMAGE Team" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "BRUTALIMAGE - AI-Powered Image Editor",
    description: "Edit Photos. Brutally Perfect. Professional AI-powered image editing.",
    type: "website",
    images: ["/download/images/editor-mockup.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BRUTALIMAGE -- AI-Powered Image Editor",
    description: "Edit Photos. Brutally Perfect.",
    images: ["/download/images/editor-mockup.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BRUTALIMAGE",
  },
};

export const viewport: Viewport = {
  themeColor: "#00ffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ServiceWorkerRegistration />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
