import { Typography } from '@material-ui/core'
import { format } from 'date-fns'
import React from 'react'

const DateTime: React.FC<{ value: string }> = ({ value }) => Date.parse(value) ? (
    <>
        <Typography display={'block'}>{format(new Date(value), 'yyyy-MM-dd')}</Typography>
        <Typography color={'textSecondary'}>{format(new Date(value), 'HH:mm:ss')}</Typography>
    </>
): null

export default DateTime
