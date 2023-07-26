import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Box, ButtonBase } from '@material-ui/core'

import ProfileSection from './ProfileSection'

import { IconMenu2 } from '@tabler/icons'
import Logo from '../../../../ui-component/Logo'

import { FormControl, InputLabel } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';


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
    const router = useRouter();
    const { t } = useTranslation('doctor');
    
    const [language, setLanguage] = React.useState('hu');

    const handleChange = (event: SelectChangeEvent) => {
        const newLang = event.target.value as string;
        setLanguage(newLang);
        router.push(router.pathname, router.asPath, { locale: newLang });
    };


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
                <Box sx={{ minWidth: 120 }} mr={5}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Language</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Language"
                        value={language}
                        onChange={handleChange}
                        defaultValue={'en'}
                        >
                            <MenuItem value={'en'}>EN</MenuItem>
                            <MenuItem value={'hu'}>HU</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            <ProfileSection />
        </>
    )
}

export default Header
