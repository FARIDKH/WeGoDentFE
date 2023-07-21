import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Box } from '@material-ui/core'
import { useQueryClient } from 'react-query'

import Logo from '../../ui-component/Logo'
import MainCard from '../../ui-component/cards/MainCard'
import withSession from '../../lib/session'
import teethImage from '../../assets/images/teeth.png'
import backgroundImage from '../../assets/images/background.png'

import { useRouter } from 'next/router'
import LoginForm from '../../modules/auth/LoginForm'

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: '475px',
        '& > *': {
            flexGrow: 1,
            flexBasis: '50%',
        },
        [theme.breakpoints.down('sm')]: {
            margin: '20px',
        },
        [theme.breakpoints.down('lg')]: {
            maxWidth: '400px',
        },
    },
    content: {
        padding: theme.spacing(5) + ' !important',
        [theme.breakpoints.down('lg')]: {
            padding: theme.spacing(3) + ' !important',
        },
    },
    leftDiv: {
        backgroundImage: `url(${teethImage.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            inset: '0',
            backgroundImage: `url(${backgroundImage.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        },
    },
}))

const LoginWrapper = () => {
    const classes = useStyles()
    const router = useRouter()

    return (
        <Box className="adminWrapper">
            <Box display="flex">
                <Box flex={1} className={classes.leftDiv} />
                <Box flex={1} display="flex" alignItems="center" justifyContent="center">
                    <MainCard className={classes?.card} contentClass={classes?.content}>
                        <Box display="flex" alignItems="center" justifyContent="center" mb={5}>
                            <Logo />
                        </Box>

                        <LoginForm onSuccess={() => router.push('/admin/dashboard')} />
                    </MainCard>
                </Box>
            </Box>
        </Box>
    )
}

// eslint-disable-next-line no-unused-vars
export const getServerSideProps = withSession(async ({ req, locale }) => {
    const user = req.session.get('tokens')

    if (user?.isLoggedIn) {
        return {
            redirect: {
                permanent: false,
                destination: '/admin/dashboard',
            },
            props: {},
        }
    } else {
        return { props: {} }
    }
})

const LoginPage = () => {
    const queryClient = useQueryClient()

    React.useEffect(() => {
        queryClient.clear()
    })

    return (
        // <MinimalLayout>
        <LoginWrapper />
        // </MinimalLayout>
    )
}

export default LoginPage
