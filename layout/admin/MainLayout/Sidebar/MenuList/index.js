import React from 'react'

import { Typography } from '@material-ui/core'

import NavGroup from './NavGroup'
import useMenuItems from '../../../../../menu-items'

const MenuList = () => {
    const menuItems = useMenuItems()
    const navItems = menuItems.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                )
        }
    })

    return navItems
}

export default MenuList
