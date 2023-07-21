import React from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { CssBaseline, StyledEngineProvider } from '@material-ui/core'

import theme from '../../themes'

function MyApp({ children }) {
    const customization = useSelector((state) => state.customization)

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme(customization)}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
export default MyApp
