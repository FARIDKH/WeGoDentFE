import React from 'react'

export interface IDescriptionItem {
    label: string
    value?: string | React.ReactNode | (() => string | React.ReactNode)
}

const DescriptionItem = ({ label, value }: IDescriptionItem) => {
    return (
        <span style={{ display: 'flex', flexDirection: 'column', padding: '10px 5px' }}>
            <span>{label}</span>
            <span
                style={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    lineHeight: '30px',
                }}
            >
                {(typeof value === 'function' ? value() : value) || '-'}
            </span>
        </span>
    )
}

export default DescriptionItem
