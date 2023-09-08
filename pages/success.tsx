import { Typography, makeStyles, Box, Container } from '@material-ui/core'
import { Button } from '@mui/material'
import Layout from '../layout/main/Layout'

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: '3rem',
    },
    subheading: {
        fontSize: '1.5rem',
        marginBottom: theme.spacing(4),
    },
    button: {
        color: 'white',
        marginTop: 20,
    },
}))

export default function Custom404() {
    const classes = useStyles()

    return (
        <Layout>
            <Box className="background-round" height="65vh" display="flex" alignItems="center">
                <Container maxWidth="lg">
                    <Typography variant="h1" className={classes.heading}>
                        Your payment <br /> has been completed successfully!
                    </Typography>

                    <Button variant="contained" color="primary" LinkComponent="a" href="/" className={classes.button}>
                        Go Home
                    </Button>
                </Container>
            </Box>
        </Layout>
    )
}
