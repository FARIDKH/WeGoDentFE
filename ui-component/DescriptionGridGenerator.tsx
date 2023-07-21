import { Box, Divider, Grid, GridSize, Typography } from '@material-ui/core'
import React from 'react'
import { gridSpacing } from '../store/constant'
import DescriptionItem, { IDescriptionItem } from './DescriptionItem'

interface IDescriptionGridGenerator {
    data: Array<IDescriptionItem[]>
    title?: string
    divide?: boolean
}

const DescriptionGridGenerator = ({ title, data, divide = true }: IDescriptionGridGenerator) => {
    const gridSize = Math.floor(12 / data.length) as GridSize

    return (
        <Box my={title ? 2 : 0}>
            {title && (
                <>
                    <Box p={1} pl={0.5}>
                        <Typography variant="h4" color="secondary">
                            {title}
                        </Typography>
                    </Box>
                    {divide && (
                        <Box my={1}>
                            <Divider />
                        </Box>
                    )}
                </>
            )}

            <Grid container spacing={gridSpacing}>
                {data.map((column, i) => (
                    <Grid key={i} item xs={12} sm={gridSize} md={gridSize}>
                        {column.map(({ label, value }) => (
                            <React.Fragment key={`${label}_description_item`}>
                                <DescriptionItem label={label} value={value} />
                            </React.Fragment>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default DescriptionGridGenerator
