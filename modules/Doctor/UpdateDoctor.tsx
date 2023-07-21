import { Box, Grid, Button } from '@material-ui/core'
import AnimateButton from '../../ui-component/extended/AnimateButton'
import PasswordInput from '../../ui-component/Form/PasswordInput'
import * as yup from 'yup'
import { useFormik } from 'formik'
import Input from '../../ui-component/Form/Input'
import { SNACKBAR_OPEN } from '../../store/actions'
import { store } from '../../pages/_app'
import axios from '../../utils/axios'

const UpdateDoctor = ({ doctor }) => {


    const { errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values } = useFormik({
        initialValues: {
            username: doctor.username,
            firstName: doctor.firstName,
            lastName : doctor.lastName,
            email: doctor.email,
            phoneNumber: doctor.phoneNumber,
            experience: doctor.experience,
            hourlyRate: doctor.hourlyRate,
            language: doctor.language,
            password: '',
            officeLocatioName : ''
        },
        validationSchema: yup.object().shape({
            username: yup.string().required('Username is required'),
            password: yup.string().required('Password is required'),
        }),
        onSubmit: async ({ username,firstName, lastName, phoneNumber, email, password, ...rest }) => {

            try {
                const newValues = {...doctor, 
                    userDTO : {...doctor.userDTO, 
                        username,firstName, lastName, phoneNumber, email, password
                    }, 
                    ...rest
                }
                await axios.patch(`/api/doctor/${doctor.id}`, newValues)

                // onSuccess: () => {
                //     store.dispatch({
                //         type: SNACKBAR_OPEN,
                //         open: true,
                //         message: 'Account has been updated successfully' ,
                //         variant: 'alert',
                //         alertSeverity: 'success',
                //         anchorOrigin: { vertical: 'top', horizontal: 'center' },
                //     })

                //     // handleClose()
                //     onSuccess()
                // }
            } catch (e) {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'ERROR',
                    variant: 'alert',
                    alertSeverity: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })
            }
        },
    })

    return (
        <Box>
            <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Input
                            id="doctor-email"
                            type="email"
                            value={values.email}
                            name="username"
                            size="medium"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Username / Email Address"
                            error={errors?.email}
                            isTouched={touched?.email}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            id="doctor-firstName"
                            type="firstName"
                            value={values.firstName}
                            name="username"
                            size="medium"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="First Name"
                            error={errors?.firstName}
                            isTouched={touched?.firstName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            id="doctor-lastName"
                            type="lastName"
                            value={values.lastName}
                            name="lastName"
                            size="medium"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Last Name"
                            error={errors?.lastName}
                            isTouched={touched?.lastName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            id="doctor-phoneNumber"
                            type="phoneNumber"
                            value={values.phoneNumber}
                            name="phoneNumber"
                            size="medium"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Phone Number"
                            error={errors?.phoneNumber}
                            isTouched={touched?.phoneNumber}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            id="doctor-experience"
                            type="phoneNumber"
                            value={values.experience}
                            name="experience"
                            size="medium"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Experience"
                            error={errors?.experience}
                            isTouched={touched?.experience}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            id="doctor-language"
                            type="phoneNumber"
                            value={values.language}
                            name="language"
                            size="medium"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Language"
                            error={errors?.language}
                            isTouched={touched?.language}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            id="doctor-rate"
                            type="hourlyRate"
                            value={values.hourlyRate}
                            name="hourlyRate"
                            size="medium"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Hourly rate"
                            error={errors?.hourlyRate}
                            isTouched={touched?.hourlyRate}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            id="doctor-office-location-name"
                            type="rate"
                            value={values.officeLocatioName}
                            name="officeLocatioName"
                            size="medium"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Office Location"
                            error={errors?.officeLocatioName}
                            isTouched={touched?.officeLocatioName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <PasswordInput
                            id="outlined-adornment-password-login"
                            value={values.password}
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Password"
                            isTouched={touched.password}
                            error={errors.password}
                        />
                    </Grid>

                    <Grid item xs={12} mt={1} display="flex" alignItems="center" justifyContent="center">
                        <AnimateButton>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                Edit Profile
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default UpdateDoctor
