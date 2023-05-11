/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    compiler: {
        styledComponents: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['testcolor99b.s3.amazonaws.com', 'testcolor99b.s3.us-east-1.amazonaws.com'],
    },
};

module.exports = nextConfig;
