const path = require('path');

const { parsed: localEnv } = require('dotenv').config({
    path: `./.env.${process.env.NODE_ENV}`
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        unoptimized: true,
    },
    env: {
        REDIRECT_URL: localEnv.NEXT_PUBLIC_REDIRECT_URL,
        APP_TITLE: localEnv.NEXT_PUBLIC_APP_TITLE,
        API_URL: localEnv.NEXT_PUBLIC_API_URL,
        SUBMISSION_API_URL: localEnv.NEXT_PUBLIC_SUBMISSION_API_URL,
        DICTIONARY_API_URL: localEnv.NEXT_PUBLIC_DICTIONARY_API_URL,
        CHAT_PLUGIN_URL: localEnv.NEXT_PUBLIC_CHAT_PLUGIN_URL,
        DEFAULT_STEP: localEnv.NEXT_PUBLIC_DEFAULT_STEP,
        DEFAULT_WORKFLOW_ID: localEnv.NEXT_PUBLIC_DEFAULT_WORKFLOW_ID,
        CACHE_DURATION: localEnv.NEXT_PUBLIC_CACHE_DURATION
    }
}

if ( process.env.NODE_ENV === 'production' ) {
    nextConfig.distDir = 'build';
    nextConfig.output = 'export';
    nextConfig.assetPrefix = '/assets';
}

module.exports = nextConfig
