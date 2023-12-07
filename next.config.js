/* eslint-disable no-undef */
const path = require('path')

let basePath = ''

if (process.env.NODE_ENV === 'production') {
    basePath = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH : ''
}

const { i18n } = require('./next-i18next.config')

module.exports = {
    basePath: basePath,
    reactStrictMode: false,
    sassOptions: {
        includePaths: [path.join(__dirname, 'assets', 'scss')],
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ['pages', 'utils', 'modules', 'menu-items', 'layout', 'store'],
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
        });

        return config;
    },
    // async redirects() {
    //     return [
    //         {
    //             source: '/en/klinikak/:name',
    //             destination: '/en/clinics/:name',
    //             permanent: false,
    //         },
    //         {
    //             source: '/en/fogorvosok/:name',
    //             locale: false,
    //             destination: '/en/doctors/:name',
    //             permanent: false,
    //         },
    //         {
    //             source: '/clinics/:name*',
    //             destination: '/klinikak/:name*',
    //             permanent: false,
    //         },
    //         {
    //             source: '/doctors/:name',
    //             destination: '/fogorvosok/:name',
    //             permanent: false,
    //             // locale: false,
    //         },
    //         // ... other redirects
    //     ];
    // },

    i18n,
};

