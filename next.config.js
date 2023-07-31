const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build',
    output: 'export',
    assetPrefix: 'http://services.brieflands.com.test/assets/',
    ssr: false,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}

module.exports = nextConfig
