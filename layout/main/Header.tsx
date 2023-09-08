import { Box, Button, Drawer, Link, List, ListItem, ListItemText, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { ListItemButton } from '@mui/material'
import { IconMenu2 as IconMenu, IconX as IconClose } from '@tabler/icons'
import React from 'react'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import Logo from '../../ui-component/Logo'
import LoginButton from './LoginButton'
import useUser from '../../lib/useUser'
import LanguagaSelect from './LanguageSelect'

const Header = () => {
    const { isLoggedIn } = useUser(false)

    const { isOpen, open, close } = useOpenState()

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <Box display="flex" justifyContent="space-between" pt={4}>
            <Logo />
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: isMobile ? 10 : 40 }}>
                {!isMobile ? (
                    <>
                        <Link sx={{ '&:hover': { textDecoration: 'none' } }} href="https://blog.wegodent.com">
                            <Typography variant="h3" fontSize="20px" sx={{ color: 'white' }}>
                                Blog
                            </Typography>
                        </Link>

                        <LanguagaSelect />

                        <LoginButton />
                    </>
                ) : (
                    <>
                        <LanguagaSelect />
                        <Button onClick={open}>{isOpen ? <IconClose /> : <IconMenu />}</Button>
                    </>
                )}
            </Box>

            {isMobile && (
                <Drawer anchor={'right'} open={isOpen} onClose={close}>
                    <Box sx={{ width: 200 }}>
                        <List>
                            <ListItem divider disableGutters>
                                <ListItemButton>
                                    <ListItemText>
                                        <Link sx={{ '&:hover': { textDecoration: 'none' } }} href="https://blog.wegodent.com">
                                            <Typography fontSize="18px">Blog</Typography>
                                        </Link>
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem divider disableGutters>
                                <ListItemButton>
                                    <Link
                                        sx={{ '&:hover': { textDecoration: 'none' } }}
                                        href={isLoggedIn ? '/admin/dashboard' : '/admin/login'}
                                    >
                                        <Typography fontSize="18px">{isLoggedIn ? 'Dashboard' : 'Login'}</Typography>
                                    </Link>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
            )}
        </Box>
    )
}

export default Header
