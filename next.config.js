/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: process.env.UPLOAD_HOST,
            protocol: 'https'
        }]
    }
}

module.exports = nextConfig
