import { Breakpoint, useMediaQuery, useTheme } from '@material-ui/core'

export const useMobile = (breakpoint: Breakpoint = 'sm') => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down(breakpoint))

    return isMobile
}
