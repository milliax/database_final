import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },{
                protocol: 'https',
                hostname: 'localhost'
            },{
                protocol: 'https',
                hostname: 'vmxwbhdgxscqqqsggmaf.supabase.co'
            }
        ]
    }
};

export default nextConfig;
