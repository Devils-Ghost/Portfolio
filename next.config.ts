import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Forces Next.js to compile down to raw static assets for Firebase
  images: {
    unoptimized: true, // Necessary for static builds when utilizing the Next.js <Image /> component
  },
};

export default nextConfig;
