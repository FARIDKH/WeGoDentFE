import { Typography } from '@material-ui/core'
import { useRouter } from 'next/router'
import React from 'react'

const Logo = ({ href = '/', style = {} }) => {
    const router = useRouter()

    const handleClick = () => href && router.push(href)

    return (
        <Typography
            sx={{
                cursor: 'pointer',
                ...style,
            }}
            onClick={handleClick}
            variant="h2"
        >
            WeGoDent.
        </Typography>
    )
}

export default Logo
