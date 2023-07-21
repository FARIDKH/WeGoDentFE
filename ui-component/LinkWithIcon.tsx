import React from 'react'
import LinkIcon from '@material-ui/icons/Link'
import Link from 'next/link'
import { Box, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    linkWithIcon: {
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        wordBreak: 'break-word',
        '& span': {
            color: theme.palette.grey[700],
            display: 'inline-block',
            paddingRight: '4px',
        },
    },
}))

const LinkWithIcon: React.FC<{ href?: any; label: string; passHref?: boolean; [key: string]: any }> = ({
    href = '',
    label,
    passHref = true,
    ...props
}) => {
    const classes = useStyles()

    return passHref ? (
        <Link passHref href={href} {...props}>
            <span className={classes.linkWithIcon}>
                <span>{label}</span>
                <LinkIcon color="primary" style={{ color: 'darkblue' }} />
            </span>
        </Link>
    ) : (
        <Box {...props}>
            <span className={classes.linkWithIcon}>
                <span>{label}</span>
                <LinkIcon color="primary" style={{ color: 'darkblue' }} />
            </span>
        </Box>
    )
}

export default LinkWithIcon
