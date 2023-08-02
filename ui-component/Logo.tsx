import { Typography } from '@material-ui/core'
import { useRouter } from 'next/router'
import React from 'react'
import wegodentlogo from '../assets/images/wego-logo-gradient.png'


import Image from 'next/image'

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
            <div >
                <Image    width={55} height={50}  src={wegodentlogo} /> 
            </div>
        </Typography>
    )
}

export default Logo
