import { Box, Typography } from '@material-ui/core'
import EmptyIcon from './PaginatedTableGenerator/EmptyIcon'

const NoResult = () => {
    return (
        <Box textAlign="center">
            <Box py={4}>
                <EmptyIcon />
            </Box>
            <Typography fontSize="16px"> No result was found</Typography>
        </Box>
    )
}

export default NoResult
