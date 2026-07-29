const cmsUrl = new URL(process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:3001')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // In dev the CMS is on localhost, which the optimizer rejects as a private
    // IP (SSRF guard). Only relax it outside production, where the CMS is
    // reached over a public hostname anyway.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    // Payload serves uploads from its own origin, so next/image needs it allowed
    remotePatterns: [
      {
        protocol: cmsUrl.protocol.replace(':', ''),
        hostname: cmsUrl.hostname,
        port: cmsUrl.port,
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
