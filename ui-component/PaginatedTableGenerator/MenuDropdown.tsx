import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

const ITEM_HEIGHT = 48

export interface IAction {
    label: string
    // eslint-disable-next-line no-unused-vars
    onClick: (obj: any) => void
    // eslint-disable-next-line no-unused-vars
    hide?: boolean
}

const MenuDropdown: React.FC<{ item?: any; actions: IAction[] }> = ({ item = null, actions, children }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div onClick={(e) => e.stopPropagation()} style={{ display: 'inline' }}>
            <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
                {children}
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                {actions.map(({ label, onClick, hide = false }) => {
                    return (
                        !hide && (
                            <MenuItem
                                key={label}
                                onClick={() => {
                                    onClick(item)
                                    handleClose()
                                }}
                            >
                                {label}
                            </MenuItem>
                        )
                    )
                })}
            </Menu>
        </div>
    )
}

export default MenuDropdown
