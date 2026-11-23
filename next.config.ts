import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Prevents double mounting in dev that can disrupt GSAP ScrollTrigger timeline registrations
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
