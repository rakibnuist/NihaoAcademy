import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const nextConfig: NextConfig = {
  // Standalone output bundles everything into .next/standalone/server.js
  // Required for Hostinger Node.js hosting (no npm start, runs node server.js directly)
  output: "standalone",

  // Pin the workspace root so webpack doesn't infer it from a higher lockfile.
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
