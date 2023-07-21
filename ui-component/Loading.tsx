import CircularProgress from '@material-ui/core/CircularProgress'
import React from 'react'

const Loading: React.FC<{ size?: number }> = ({ size = 20 }) => (
    <div style={{ textAlign: 'center', padding: '20px' }}>
        <CircularProgress size={size} color="secondary"  />
    </div>
)

export default Loading
