import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@/styles/prism.css";
import ThemeProvider from "@/context/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: { default: "Dev Overflow", template: "%s | DevTalks" },
  description: `A community-driven platform for asking and answering
     programming questions. Get help, Share knowledge, 
     and collaborate with developers from around the world. 
     Explore topics in web development, mobile app development, 
     algorithms, data structures, and much more.`,
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
  openGraph: {
    title: "Dev Overflow",
    description: `A community-driven platform for asking and answering
     programming questions. Get help, Share knowledge, 
     and collaborate with developers from around the world. 
     Explore topics in web development, mobile app development, 
     algorithms, data structures, and much more.`,
    url: "https://devoverflow.it",
    siteName: "Dev Overflow",
    locale: "en_GB",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Dev Overflow",
    card: "summary_large_image",
  },
  verification: {
    google: "eZSdmzAXlLkKhNJzfgwDqWORghxnJ8qR9_CHdAh5-xw",
    yandex: "14d2e73487fa6c71",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
