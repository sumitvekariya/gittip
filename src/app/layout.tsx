import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "../providers/Provider";
import { Toaster } from "@/components/ui/toaster";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gittip",
  description: "Convert your GitHub profile into a Solana blink to receive donations / get hired",
  openGraph: {
    images: [
      {
        url: "https://gittip.dev/vercel.svg",
        width: 1200,
        height: 630,
        alt: "Gittip",
      },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastContainer />

        <Provider>
          {children}
        </Provider></body>
    </html>
  );
}
