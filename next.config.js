/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            hostname: 'utfs.io',
            protocol: 'https'
        }, {
            hostname: 'static.easypack24.net',
            protocol: 'https'
        }]
    }
}

module.exports = nextConfig
