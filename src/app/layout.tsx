import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Exposed as a CSS variable rather than applied via inter.className, so
// globals.css can point --font-sans at it and `font-sans` utilities finally
// resolve to the font we actually load.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" className={`${inter.variable} dark h-full`}>
      <body className="font-sans bg-black text-white antialiased h-full">
        {children}
      </body>
    </html>
  );
}
