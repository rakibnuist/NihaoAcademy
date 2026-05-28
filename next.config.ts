import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output: bundles only the files needed to run the server.
  // Drastically reduces memory usage on constrained hosting (Hostinger Business).
  output: "standalone",

  // Pin the file-tracing root to THIS project so the standalone output layout
  // is identical everywhere. Without this, a stray package-lock.json in a
  // parent directory (e.g. the home dir on a dev machine) makes Next.js infer a
  // higher workspace root and nest the server under .next/standalone/<name>/.
  // Using process.cwd() (build/start always run from the project root) avoids
  // the import.meta.url form that crashes `next start` in production CJS mode.
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
