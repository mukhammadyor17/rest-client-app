/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  experimental: {
    optimizeCss: false,
  },
};
const withNextIntl = createNextIntlPlugin();
// export default nextConfig;
export default withNextIntl(nextConfig);
