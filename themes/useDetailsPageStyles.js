import { makeStyles } from '@material-ui/core/styles'
import { gridSpacing } from '../store/constant'

const useDetailsPageStyles = makeStyles((theme) => ({
    tabs: {
        margin: '0 -24px',
        '& .Mui-selected': {
            color: '#4CD48B',
        },
        '& .MuiTabs-indicator': {
            background: '#4CD48B',
        },
    },
    card: {
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
    divider: {
        borderColor: theme.palette.primary.main,
        marginBottom: theme.spacing(gridSpacing),
    },
}))

export default useDetailsPageStyles
