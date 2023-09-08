import { Box, Container, Paper, TextField, InputAdornment, IconButton, makeStyles } from '@material-ui/core'
import { IconSearch } from '@tabler/icons'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import { ENUM_DOCTOR_TYPES } from '../../hooks/useDoctor'
import Logo from '../../ui-component/Logo'
import DoctorTypeSelect from '../../ui-component/main/DoctorTypeSelect'
import LoginButton from './LoginButton'

const useStyle = makeStyles(() => ({
    paper: {
        height: '45px',
        borderRadius: '50px',
        display: 'flex',
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
        },
    },
}))

const Header2 = () => {
    const { query, push } = useRouter()
    const classes = useStyle()

    return (
        <Box className="mainBlueBgGradient" paddingY={2}>
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                    <Logo
                        style={{
                            color: 'white',
                        }}
                    />

                    <Formik
                        enableReinitialize
                        initialValues={{
                            doctorType: (query?.doctorType ?? ENUM_DOCTOR_TYPES.General_Dentist) as string,
                            officeLocation: query?.officeLocation as string,
                        }}
                        onSubmit={(values) => {
                            if (values?.doctorType && values?.officeLocation)
                                push({
                                    pathname: '/doctors',
                                    query: values,
                                })
                        }}
                    >
                        {({ handleSubmit, values, handleChange }) => (
                            <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                <Paper className={classes.paper}>
                                    <DoctorTypeSelect
                                        className={classes.selectDoctorType}
                                        name="doctorType"
                                        value={values?.doctorType}
                                        variant="outlined"
                                        IconComponent={() => null}
                                        handleChange={handleChange}
                                    />

                                    <TextField
                                        className={classes.inputOfficeLocation}
                                        name="officeLocation"
                                        value={values?.officeLocation}
                                        onChange={handleChange}
                                        placeholder="Budapest I. Kerulet"
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => handleSubmit()}
                                                        sx={{
                                                            padding: 0,
                                                        }}
                                                    >
                                                        <IconSearch />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Paper>
                            </form>
                        )}
                    </Formik>

                    <LoginButton
                        variant="outlined"
                        sx={{
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': {
                                borderColor: 'white',
                            },
                        }}
                    />
                </Box>
            </Container>
        </Box>
    )
}

export default Header2
