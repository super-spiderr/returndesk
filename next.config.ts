import type { NextConfig } from "next";

// Static export: no backend, no database, deployed as plain HTML/CSS/JS
// to Cloudflare Pages via auto-deploy from GitHub.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Pin the workspace root: a stray lockfile in an ancestor directory
  // otherwise makes Turbopack guess and warn.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
