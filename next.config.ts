import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16's Cache Components model (PROJECT_PLAN.md Phase 3): nothing is
  // cached implicitly anymore. A function opts in with "use cache", tagged
  // with cacheTag()/cacheLife(), invalidated with updateTag()/revalidateTag().
  cacheComponents: true,
};

export default nextConfig;
