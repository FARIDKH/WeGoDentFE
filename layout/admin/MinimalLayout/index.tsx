import React, { PropsWithChildren } from 'react'

import BaseLayout from '../BaseLayout'

const MinimalLayout = (props) => {
    return <BaseLayout>{props.children}</BaseLayout>
}

const BaseWrappedMinimalLayout = ({ children }: PropsWithChildren<{}>) => {
    return (
        <BaseLayout>
            <MinimalLayout>{children}</MinimalLayout>
        </BaseLayout>
    )
}

export default BaseWrappedMinimalLayout
