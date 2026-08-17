import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dhaval Tanna | Full-Stack Software Engineer",
  description:
    "Enterprise Software Engineer building secure, scalable systems.",
};

/**
 * The document shell, and nothing else. Route groups nest their own layouts
 * inside this one, so site chrome (splash, navbar, footer, scrollbar) lives
 * in `(site)/layout.tsx` rather than here — that's what lets `(admin)` opt
 * out of all of it later without playing the 2s splash on every page load.
 */
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
        {children}
      </body>
    </html>
  );
}
