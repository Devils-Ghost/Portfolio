import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dhaval Tanna | Full-Stack Software Engineer",
  description:
    "Enterprise Software Engineer building secure, scalable systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <body
        className={`${inter.className} bg-black text-white antialiased h-full`}
      >
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
