/* eslint-disable no-undef */
/* eslint-disable react/display-name */
import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/styles'
import theme from '../themes'
import config from '../config'

const customization = {
    isOpen: [], //for active default menu
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    outlinedFilled: config.outlinedFilled,
    navType: config.theme,
    presetColor: config.presetColor,
    locale: config.i18n,
    rtlLayout: config.rtlLayout,
    opened: true,
}

const googleTagManagerId = 'GTM-MQ4R7G9V'

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang={customization?.locale}>
                <Head>
                    {/* PWA primary color */}
                    <meta name="theme-color" content={theme(customization).palette.primary.main} />
                    <link rel="icon" href="/wego-32x32.png" />
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
                    {/* Google Tag Manager Script */}
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${googleTagManagerId}');
                        `,
                        }}
                    />
                    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDie3vhIC31IVaOVs7Qd3_CcQZTFjWGlns&libraries=places"></script>


                    {/* End Google Tag Manager (noscript) */}
                </Head>
                <body>
                    {/* Google Tag Manager (noscript) */}
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                        />
                    </noscript>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        })

    const initialProps = await Document.getInitialProps(ctx)

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    }
}
