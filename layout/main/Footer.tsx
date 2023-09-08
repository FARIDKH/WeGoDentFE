import { Box, Button, Container, List, ListItem, makeStyles, TextField, Typography } from '@material-ui/core'
import { useState } from 'react'

const useStyle = makeStyles(() => ({
    inputEmail: {
        flex: 1,
        '& .MuiOutlinedInput-root': {
            '& input.MuiOutlinedInput-input': {
                borderRadius: 0,
            },

            '& fieldset': {
                borderRadius: 0,
            },
        },
    },
    buttonSubscribe: {
        background: '#296F89',
        color: 'white',
        borderRadius: 0,
        border: '1px solid white',
        '&:hover': {
            background: '#296F89',
        },
    },
}))

const Footer = () => {
    const classes = useStyle()

    const [email, setEmail] = useState('')

    return (
        <Box
            sx={{
                background: '#296F89',
                color: 'white',
            }}
            paddingY={4}
        >
            <Container maxWidth="lg">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{
                        gap: '30px',
                        flexDirection: {
                            md: 'row',
                            xs: 'column',
                        },
                    }}
                >
                    <Box>
                        <Typography variant="h1" color="inherit">
                            Newsletter
                        </Typography>
                        <Typography my={2}>Want to know what we're up to? Sign up for the newsletter and join our tribe</Typography>

                        <Box display="flex">
                            <TextField
                                className={classes?.inputEmail}
                                name="officeLocation"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                variant="outlined"
                            />
                            <Button variant="contained" className={classes?.buttonSubscribe}>
                                Subscribe
                            </Button>
                        </Box>
                    </Box>
                    <Box>
                        <Box mb={1}>
                            <Typography variant="h2" color="inherit">
                                Address
                            </Typography>
                            <List>
                                <ListItem disableGutters>Budapest, Hungary</ListItem>
                            </List>
                        </Box>
                        <Box>
                            <Typography variant="h2" color="inherit">
                                Contact
                            </Typography>
                            <List>
                                <ListItem disableGutters>Phone: +(34)1234567</ListItem>
                                <ListItem disableGutters>Email: wegodent@support.com</ListItem>
                            </List>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default Footer
