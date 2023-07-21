import React from 'react'
import useUser from '../lib/useUser'

type CurrentUserProps = {
    // eslint-disable-next-line no-unused-vars
    children?: React.ReactNode | ((data: any) => React.ReactNode)
}

const CurrentUser = ({ children }: CurrentUserProps) => {
    const data = useUser()

    if (typeof children === 'function') {
        return children(data)
    }

    return children || null
}

export default CurrentUser
