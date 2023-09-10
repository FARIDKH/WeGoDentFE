import * as React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Box, ButtonBase } from '@material-ui/core'

import ProfileSection from './ProfileSection'

import { IconMenu2 } from '@tabler/icons'
import Logo from '../../../../ui-component/Logo'

import LanguagaSelect from '../../../LanguageSelect'

const useStyles = makeStyles((theme: any) => ({
    grow: {
        flexGrow: 1,
    },
    headerAvatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        transition: 'all .2s ease-in-out',
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
        color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
        '&:hover': {
            background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
            color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light,
        },
    },
    boxContainer: {
        width: '228px',
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            width: 'auto',
        },
    },
}))

const Header = ({ handleLeftDrawerToggle }) => {
    const classes = useStyles()

    return (
        <>
            <div className={classes.boxContainer}>
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <Logo href={'/admin/dashboard'} />
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar variant="rounded" className={classes.headerAvatar} onClick={handleLeftDrawerToggle} color="inherit">
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </div>

            <div className={classes.grow} />
            <div className={classes.grow} />
            <Box mr={1}>
                <LanguagaSelect />
            </Box>
            <ProfileSection />
        </>
    )
}

export default Header
