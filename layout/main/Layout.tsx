import { Box } from '@material-ui/core'
import Footer from './Footer'

const Layout = ({ children }) => {
    return (
        <Box>
            <Box>{children}</Box>
            <Footer />
        </Box>
    )
}

export default Layout
