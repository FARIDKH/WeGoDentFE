import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { AppBar, CssBaseline, Toolbar, useMediaQuery } from '@material-ui/core'
import clsx from 'clsx'

// import Breadcrumbs from './../../ui-component/extended/Breadcrumbs';
import Header from './Header'
import Sidebar from './Sidebar'
// import navigation from './../../menu-items';
import { drawerWidth } from '../../../store/constant'
import { SET_MENU } from '../../../store/actions'

import BaseLayout from '../BaseLayout'
import useUser from '../../../lib/useUser'
import Loading from '../../../ui-component/Loading'

// style constant
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        backgroundColor: theme.palette.background.default,
    },
    appBarWidth: {
        backgroundColor: theme.palette.background.default,
    },
    content: {
        position: 'relative',
        ...theme.typography.mainContent,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        [theme.breakpoints.up('md')]: {
            marginLeft: -(drawerWidth - 20),
            width: `calc(100% - ${drawerWidth}px)`,
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
            marginRight: '10px',
        },
    },
    contentShift: {
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
        },
    },
}))

const MainLayout = ({ children }) => {
    const classes = useStyles()
    const theme = useTheme()
    const matchUpMd = useMediaQuery(theme.breakpoints.up('md'))

    // Handle left drawer
    const leftDrawerOpened = useSelector((state) => state.customization.opened)
    const dispatch = useDispatch()
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: !leftDrawerOpened })
    }

    React.useEffect(() => {
        const openLeftDrawerState = (val) => {
            dispatch({ type: SET_MENU, opened: val })
        }
        openLeftDrawerState(matchUpMd)
    }, [dispatch, matchUpMd])

    return (
        <div className={clsx([classes.root, 'adminWrapper'])}>
            <CssBaseline />
            {/* header */}
            <AppBar position="fixed" color="inherit" elevation={0} className={leftDrawerOpened ? classes.appBarWidth : classes.appBar}>
                <Toolbar>
                    <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                </Toolbar>
                    
            </AppBar>

            <Sidebar drawerOpen={leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

            <main
                className={clsx([
                    classes.content,
                    {
                        [classes.contentShift]: leftDrawerOpened,
                    },
                ])}
            >
                <div>{children}</div>
            </main>
        </div>
    )
}

MainLayout.propTypes = {
    children: PropTypes.node,
}

const BaseWrappedMainLayout = ({ children }) => {
    const { user } = useUser()

    return <BaseLayout>{user ? <MainLayout>{children}</MainLayout> : <Loading />}</BaseLayout>
}

export default BaseWrappedMainLayout
