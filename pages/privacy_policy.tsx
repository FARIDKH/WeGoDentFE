import { Typography, makeStyles, Box, Container } from '@material-ui/core'
import { Button } from '@mui/material'
import Layout from '../layout/main/Layout'
import PolicyPage  from './pol'

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: '5rem',
    },
    subheading: {
        fontSize: '1.5rem',
        marginBottom: theme.spacing(4),
    },
    button: {
        color: 'white',
    },
    iframeContainer: {
        maxHeight: '50vh', // 90% of the viewport height
        overflow: 'auto',  // Enable scrolling
        padding:"10px",
        marginBottom:"50px",
        paddingLeft: 0
    },
}))

export default function Custom404() {
    const classes = useStyles()

    return (
        <Layout title="Wegodent - Privacy policy" description="Wegodent - Privacy policy">
            <Box className="background-round"  height="65vh" display="flex" alignItems="center">
                <Container maxWidth="lg">
                    <PolicyPage></PolicyPage>
                    <Button variant="contained" color="primary" LinkComponent="a" href="/" className={classes.button}>
                        Go Home
                    </Button>
                </Container>
            </Box>
        </Layout>
    )
}
