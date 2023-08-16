const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // distDir: 'build',
    // output: 'export',
    // assetPrefix: '__service_url__',
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
}

module.exports = nextConfig
