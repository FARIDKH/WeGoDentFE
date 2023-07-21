import React from 'react'
import { useRouter } from 'next/router'
import { Box, Grid, Typography, makeStyles } from '@material-ui/core'
import Chip from '../ui-component/extended/Chip'

const useStyles = makeStyles({
    chipGroupWrapper: {
        padding: '6px 10px',
        border: '1px solid #616161',
        borderRadius: 50,
    },
    label: {
        paddingLeft: 0,
    },
})

const FilterChipGroup = ({ filterKey: key, label, value, pathname }) => {
    const router: any = useRouter()
    const classes = useStyles()

    const handleDelete = (item = null) => {
        let query = { ...router.query, page: 0 }

        if (item) {
            query[key] = value.filter((i) => i !== item)
        } else {
            delete query[key]
        }

        const queryStr = new URLSearchParams(query).toString()
        router.push(`${pathname}?${queryStr}`)
    }

    return (
        <>
            <Box className={classes.chipGroupWrapper}>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography variant="subtitle1">{label}</Typography>
                    </Grid>

                    {value?.map((item, index) => (
                        <Grid item key={index}>
                            <Chip label={item} onDelete={() => handleDelete(item)} />
                        </Grid>
                    ))}

                    <Grid item key={`${key}-clear-all`}>
                        <Chip classes={{ label: classes.label }} onDelete={() => handleDelete()} />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

const FilterChips = ({ values, excludeList = [], pathname = null }) => {
    const router: any = useRouter()
    const routerPathName = pathname ?? router.pathname

    const handleDelete = (key) => {
        const query = { ...router.query, page: 0 }
        delete query[key]

        const queryStr = new URLSearchParams(query).toString()
        router.push(`${routerPathName}?${queryStr}`)
    }

    const handleClearAll = () => {
        const query = {}
        excludeList?.forEach((key) => router.query?.[key] && (query[key] = router.query?.[key]))

        const queryStr = new URLSearchParams(query).toString()
        router.push(`${routerPathName}?${queryStr}`)
    }

    return (
        <>
            {!!values.length && (
                <Box display="flex" flexWrap="wrap" gap={1} p={3} alignItems="center">
                    {values
                        .filter(({ label }) => label != null)
                        .map(({ key, label, ...rest }) => {
                            const chipArr = rest?.value?.split(',')
                            const chipLabel = !chipArr || chipArr?.length > 1 ? label : `${label}: ${rest.value}`

                            return chipArr?.length > 1 ? (
                                <FilterChipGroup key={key} pathname={routerPathName} filterKey={key} value={chipArr} label={chipLabel} />
                            ) : (
                                <Chip key={key} label={chipLabel} onDelete={() => handleDelete(key)} />
                            )
                        })}
                    {values.length > 1 && <Chip key={'clear'} label={'Clear all'} onClick={handleClearAll} />}
                </Box>
            )}
        </>
    )
}

export default FilterChips
