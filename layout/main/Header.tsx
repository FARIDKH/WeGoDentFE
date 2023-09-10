import { Box, Link, Typography } from '@material-ui/core'
import React from 'react'
import Logo from '../../ui-component/Logo'
import LoginButton from './LoginButton'
import LanguagaSelect from '../LanguageSelect'
import MobileMenu from './MobileMenu'
import { useMobile } from '../../ui-component/hooks/useMobile'

const Header = () => {
    const isMobile = useMobile()

    return (
        <Box display="flex" justifyContent="space-between" pt={4}>
            <Logo />
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: isMobile ? 10 : 40 }}>
                {!isMobile ? (
                    <>
                        <Link sx={{ '&:hover': { textDecoration: 'none' } }} href="https://blog.wegodent.com">
                            <Typography
                                variant="h3"
                                fontSize="20px"
                                sx={{
                                    color: {
                                        xl: 'black',
                                        sm: 'white',
                                    },
                                }}
                            >
                                Blog
                            </Typography>
                        </Link>

                        <LanguagaSelect />

                        <LoginButton />
                    </>
                ) : (
                    <>
                        <LanguagaSelect />
                        <MobileMenu />
                    </>
                )}
            </Box>
        </Box>
    )
}

export default Header
