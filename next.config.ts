import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output: bundles only the files needed to run the server.
  // Drastically reduces memory usage on constrained hosting (Hostinger Business).
  output: "standalone",
};

export default nextConfig;
