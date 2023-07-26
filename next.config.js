/* eslint-disable no-undef */
const path = require('path')

let basePath = ''

if (process.env.NODE_ENV === 'production') {
    basePath = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH : ''
}

const { i18n } = require('./next-i18next.config');

module.exports = {
    basePath: basePath,
    reactStrictMode: false,
    sassOptions: {
        includePaths: [path.join(__dirname, 'assets', 'scss')],
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ['pages', 'utils', 'modules', 'menu-items', 'layout', 'store'],
        //  dirs: ['pages', 'utils']
    },
    env: {
        NEXT_PUBLIC_BASE_PATH: basePath,
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.(mp3)$/,
            type: 'asset/resource',
            generator: {
                filename: 'static/chunks/[path][name].[hash][ext]',
            },
        })

        return config
    },
    async rewrites() {
        return [
            {
                source: '/reports',
                destination: '/reports/main',
            },
        ]
    },
    i18n
    
}
