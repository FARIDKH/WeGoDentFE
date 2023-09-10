import { IconMenu2 as IconMenu, IconX as IconClose, IconNews } from '@tabler/icons'
import IconPerson from '@material-ui/icons/Person'
import IconHome from '@material-ui/icons/Home'
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, Link, Typography, Button, ButtonProps } from '@material-ui/core'
import { ListItemButton } from '@mui/material'
import useUser from '../../lib/useUser'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import { useMobile } from '../../ui-component/hooks/useMobile'

interface IProps {
    buttonProps?: ButtonProps
}

const MobileMenu = ({ buttonProps }: IProps) => {
    const { isLoggedIn } = useUser(false)

    const { isOpen, open, close } = useOpenState()

    const isMobile = useMobile()

    const menu = [
        {
            title: 'Home',
            link: '/',
            icon: IconHome,
        },
        {
            title: 'Blog',
            link: 'https://blog.wegodent.com',
            icon: IconNews,
        },
        {
            title: isLoggedIn ? 'Dashboard' : 'Login',
            link: isLoggedIn ? '/admin/dashboard' : '/admin/login',
            icon: IconPerson,
        },
    ]

    return (
        <>
            {isMobile && (
                <>
                    <Button
                        onClick={open}
                        sx={{
                            color: '#000',
                        }}
                        {...buttonProps}
                    >
                        {isOpen ? <IconClose /> : <IconMenu />}
                    </Button>

                    <Drawer anchor={'right'} open={isOpen} onClose={close}>
                        <Box sx={{ width: 200 }}>
                            <List>
                                {menu?.map(({ icon: Icon, ...item }) => (
                                    <ListItem key={item?.title} divider disableGutters>
                                        <ListItemButton>
                                            {Icon && (
                                                <ListItemIcon>
                                                    <Icon />
                                                </ListItemIcon>
                                            )}

                                            <ListItemText>
                                                <Link sx={{ color: 'black', '&:hover': { textDecoration: 'none' } }} href={item?.link}>
                                                    <Typography fontSize="18px">{item?.title}</Typography>
                                                </Link>
                                            </ListItemText>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </>
            )}
        </>
    )
}

export default MobileMenu
