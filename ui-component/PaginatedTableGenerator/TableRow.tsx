import React from 'react'
import { TableCell, TableRow, Box, Collapse, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import MenuDropdown from './MenuDropdown'

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
})

const Row = ({ columns, row, rowStyle, onRowClick, collapse, actions, onRightClick = null }) => {
    const classes = useRowStyles()
    const [collapseIn, setCollapseIn] = React.useState(false)

    let rowActions = typeof actions === 'function' ? actions?.(row) : actions
    rowActions = !rowActions ? [] : rowActions?.filter((x) => !x?.hide)

    return (
        <>
            <TableRow
                className={collapse ? classes.root : ''}
                sx={{ cursor: 'pointer', ...rowStyle?.(row) }}
                hover
                role="checkbox"
                tabIndex={-1}
                onClick={() => onRowClick?.(row)}
                onContextMenu={() => {
                    const url = onRightClick?.(row)
                    if (url) {
                        const win = window.open(url, '_blank')
                        win?.focus()
                    }
                }}
            >
                {columns.map(
                    ({ hide = false, ...headCell }) =>
                        !hide &&
                        headCell && (
                            <TableCell
                                key={headCell.id}
                                align={headCell.align}
                                padding={headCell.disablePadding ? 'none' : 'normal'}
                                sx={{
                                    '&': { width: headCell?.width ? `${headCell.width}px` : 'auto' },
                                    '&:not(.MuiTableCell-paddingNone)': { padding: '16px 8px' },
                                }}
                                onClick={(e) => headCell?.nonClickable && e.stopPropagation()}
                            >
                                {headCell.renderAs?.(row) ?? row[headCell.id] ?? '-'}
                            </TableCell>
                        )
                )}
                {!!collapse && (
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation()
                                setCollapseIn(!collapseIn)
                            }}
                        >
                            {collapseIn ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                )}
                {!!rowActions.length && (
                    <TableCell align="right" padding="none">
                        <MenuDropdown actions={rowActions} item={row}>
                            <MoreVertIcon />
                        </MenuDropdown>
                    </TableCell>
                )}
            </TableRow>
            {!!collapse && (
                <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={actions ? columns.length + 2 : columns.length + 1}>
                        <Collapse in={collapseIn} timeout="auto" unmountOnExit>
                            <Box margin={0} padding="10px" style={{ backgroundColor: '#fff', marginTop: -2 }}>
                                <Box
                                    style={{
                                        background: 'rgb(250, 250, 250)',
                                        border: '1px solid rgb(227, 232, 232)',
                                        borderRadius: 4,
                                        margin: 10,
                                        marginTop: 0,
                                        padding: 10,
                                    }}
                                >
                                    {collapse?.(row)}
                                </Box>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            )}
        </>
    )
}

export default Row
