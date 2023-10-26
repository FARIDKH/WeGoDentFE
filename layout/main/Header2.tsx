import { Box, Container, InputAdornment, IconButton, makeStyles } from '@material-ui/core'
import { IconSearch } from '@tabler/icons'
import { useMobile } from '../../ui-component/hooks/useMobile'
import Logo from '../../ui-component/Logo'
import LanguagaSelect from '../LanguageSelect'
import LoginButton from './LoginButton'
import MobileMenu from './MobileMenu'
import SearchForm from './SearchForm'
import { useTranslation } from 'next-i18next'


const useStyle = makeStyles((theme) => ({
    wrapper: {
        height: '45px',
        borderRadius: '50px',
        display: 'flex',
        background: 'white',
        [theme.breakpoints.down('sm')]: {
            height: 'auto',
            flexDirection: 'column',
        },
    },
    selectDoctorType: {
        height: '100%',
        background: 'transparent',
        borderRadius: 0,
        borderRight: '1px solid #D9D9D9',
        '& .MuiSelect-root': {
            padding: '4px',
            paddingRight: '16px !important',
            paddingLeft: '16px',
            background: 'transparent',
        },
        '& fieldset': {
            border: 0,
        },
        [theme.breakpoints.down('sm')]: {
            height: '32px',
            border: '.5px solid black',
            borderRadius: '50px',
            marginBottom: 10,
            boxShadow: theme.shadows[3],

            '& .MuiSvgIcon-root': {
                marginRight: '12px',
            },
        },
    },
    inputOfficeLocation: {
        '& .MuiOutlinedInput-root': {
            background: 'transparent',
            height: '100%',
            paddingTop: '0',
            '& input.MuiOutlinedInput-input': {
                background: 'transparent',
                paddingTop: '12px',
                paddingBottom: '12px',
            },

            '& fieldset': {
                border: 0,
            },
            [theme.breakpoints.down('sm')]: {
                height: '32px',
                border: '.5px solid black',
                borderRadius: '50px',
                boxShadow: theme.shadows[3],

                '& .MuiButtonBase-root svg': {
                    width: 20,
                },
            },
        },
    },
}))

export const HeaderSearchForm = () => {
    const classes = useStyle()
    const isMobile = useMobile()

    const { t, i18n } = useTranslation('common')


    return (
        <SearchForm
            curLang={i18n.language}
            selectProps={
                !isMobile && {
                    IconComponent: () => null,
                }
            }
            classNames={{
                wrapper: classes.wrapper,
                doctorSelect: classes.selectDoctorType,
                locationInput: classes.inputOfficeLocation,
            }}
            searchButton={
                <InputAdornment position="end">
                    <IconButton
                        type="submit"
                        sx={{
                            padding: 0,
                        }}
                    >
                        <IconSearch />
                    </IconButton>
                </InputAdornment>
            }
        />
    )
}

const Header2 = ({ showForm = true }) => {
    const isMobile = useMobile()
    return (
        <Box className="mainBlueBgGradient" paddingY={2}>
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                    <Logo
                        style={{
                            color: 'white',
                        }}
                    />

                    {!isMobile && showForm && <HeaderSearchForm />}

                    <Box display="flex" gap={3}>
                        <LanguagaSelect
                            selectProps={{
                                sx: {
                                    '& div': {
                                        background: 'none',
                                        color: 'white',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        fill: 'white',
                                    },
                                },
                            }}
                        />

                        {isMobile ? (
                            <MobileMenu
                                buttonProps={{
                                    sx: {
                                        color: 'white',
                                    },
                                }}
                            />
                        ) : (
                            <LoginButton
                                variant="outlined"
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    '&:hover': {
                                        borderColor: 'white',
                                    },
                                    height: 'auto',
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default Header2
