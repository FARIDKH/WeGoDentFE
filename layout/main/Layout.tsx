import { Box } from '@material-ui/core'
import Head from 'next/head'
import Footer from './Footer'

const Layout = ({ children, title = null }) => {
    return (
        <>
            {title && (
                <Head>
                    <title>{title}</title>
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
