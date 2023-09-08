import { Typography, makeStyles, Box, Container } from '@material-ui/core'
import { Button } from '@mui/material'
import Layout from '../layout/main/Layout'

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
}))

export default function Custom404() {
    const classes = useStyles()

    return (
        <Layout>
            <Box className="background-round" height="65vh" display="flex" alignItems="center">
                <Container maxWidth="lg">
                    <Typography variant="h1" className={classes.heading}>
                        4 0 4
                    </Typography>
                    <Typography variant="h2" className={classes.subheading}>
                        Page not found
                    </Typography>
                    <Button variant="contained" color="primary" LinkComponent="a" href="/" className={classes.button}>
                        Go Home
                    </Button>
                </Container>
            </Box>
        </Layout>
    )
}
