import { Box } from '@material-ui/core'
import Head from 'next/head'
import Footer from './Footer'

const Layout = ({ children,description = null, title = null }) => {
    return (
        <>
            {title && (
                <Head>
                    <title>{title}</title>
                    
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta name="description" content={description} />

                </Head>
            )}
            <Box>
                <Box>{children}</Box>
                <Footer />
            </Box>
        </>
    )
}

export default Layout
