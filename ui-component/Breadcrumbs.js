import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent, Grid, Typography, Breadcrumbs as MuiBreadcrumbs } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { IconChevronRight, IconHome } from '@tabler/icons'
import Link from './LinkRef'
import { gridSpacing } from '../store/constant'
import { FILTER_STATE } from '../store/actions'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: 'auto',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
        minWidth: 160,
    },
    profileTab: {
        '& .MuiTabs-flexContainer': {
            borderBottom: 'none',
        },
        '& button': {
            color: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[600],
            minHeight: 'auto',
            minWidth: '100%',
            padding: '12px 16px',
        },
        '& button.Mui-selected': {
            color: theme.palette.primary.main,
            background: theme.palette.grey[50],
        },
        '& button > span': {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            textAlign: 'left',
            justifyContent: 'flex-start',
        },
        '& button > span > svg': {
            marginBottom: '0px !important',
            marginRight: '10px',
            marginTop: '10px',
            height: '20px',
            width: '20px',
        },
        '& button > span > div > span': {
            display: 'block',
        },
        '& button > span > span + svg': {
            margin: '0px 0px 0px auto !important',
            width: '14px',
            height: '14px',
        },
        '& > div > span': {
            display: 'none',
        },
    },
    card: {
        // marginBottom: theme.spacing(gridSpacing),
        border: '1px solid',
        borderColor: '#8B9FA175',
        borderRadius: 0,
        width: '100%',
        marginTop: -8,
        marginBottom: 0,
    },
    link: {
        display: 'flex',
        color: theme.palette.grey[900],
        textDecoration: 'none',
        alignContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    },
    activeLink: {
        display: 'flex',
        textDecoration: 'none',
        alignContent: 'center',
        alignItems: 'center',
        color: theme.palette.grey[500],
    },
    icon: {
        marginRight: theme.spacing(0.75),
        marginTop: '-' + theme.spacing(0.25),
        width: '1rem',
        height: '1rem',
        color: '#3FB0AC',
    },
    content: {
        padding: '16px !important',
    },
    noPadding: {
        padding: '16px !important',
        paddingLeft: '0 !important',
    },
    bcCard: {
        marginBottom: theme.spacing(gridSpacing),
        border: '1px solid',
        borderColor: '#8B9FA175',
    },
    titleTop: {
        marginBottom: theme.spacing(1),
    },
    titleBottom: {
        marginTop: theme.spacing(1),
    },
    divider: {
        borderColor: theme.palette.primary.main,
        marginBottom: theme.spacing(gridSpacing),
    },
}))

const Breadcrumbs = ({ setup = {}, header = '' }) => {
    const dispatch = useDispatch()
    const filter = useSelector((state) => state.filter)
    const classes = useStyles()
    const referer = filter.prev?.referer
    const callArg = { referer: filter.prev, current: filter.curr, resources: filter.resources }

    const items = referer && setup[referer] ? setup[referer](callArg) : setup['_'](callArg)

    if (items.length) {
        return (
            <Card style={{ marginBottom: 5 }} className={classes.bcCard}>
                <CardContent className={classes.content}>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Grid item>
                            <Typography variant="h3" sx={{ fontWeight: 500 }}>
                                {header}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <MuiBreadcrumbs aria-label="breadcrumb" maxItems={8} separator={<IconChevronRight className={classes.icon} />}>
                                <Typography component={Link} href="/dashboard" color="inherit" variant="subtitle1" className={classes.link}>
                                    <IconHome style={{ marginRight: 0 }} className={classes.icon} />
                                </Typography>
                                {items.map((item, itemIndex) => (
                                    <Typography
                                        key={itemIndex}
                                        component={Link}
                                        href={item.path || '#'}
                                        variant="subtitle1"
                                        className={item?.path ? classes.link : classes.activeLink}
                                        onClick={() => {
                                            const action = {
                                                type: FILTER_STATE,
                                                payload: {
                                                    // prev: null,
                                                    curr: null,
                                                },
                                            }

                                            dispatch(action)
                                        }}
                                    >
                                        {item?.title}
                                    </Typography>
                                ))}
                            </MuiBreadcrumbs>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    return null
}

export default Breadcrumbs
