import { Box, Grid, Button } from '@material-ui/core'
import AnimateButton from '../../ui-component/extended/AnimateButton'
import PasswordInput from '../../ui-component/Form/PasswordInput'
import * as yup from 'yup'
import { useFormik } from 'formik'
import Input from '../../ui-component/Form/Input'
import { SNACKBAR_OPEN } from '../../store/actions'
import { store } from '../../pages/_app'
import axios from '../../utils/axios'


const UpdateAccount = ({ account }) => {
    

    const { errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values } = useFormik({
        initialValues: {
            username: account.username,
            firstName: account.firstName,
            lastName : account.lastName,
            email: account.email,
            phoneNumber: account.phoneNumber,
            password: '',
        },
        validationSchema: yup.object().shape({
            username: yup.string().required('Username is required'),
            password: yup.string().required('Password is required'),
        }),
        onSubmit: async ({ username,firstName, lastName, phoneNumber, email, password, ...rest }) => {

            try {
                // const newValues = {...patient, 
                //     userDTO : {...patient.userDTO, 
                //         username,firstName, lastName, phoneNumber, email, password
                //     }, 
                //     ...rest
                // }
                await axios.put(`/api/account/${account.id}`, values)

                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'Account has been updated successfully' ,
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })
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
                            id="account-email"
                            type="email"
                            value={account.email}
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
                            id="account-firstName"
                            type="firstName"
                            value={account.firstName}
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
                            id="account-lastName"
                            type="lastName"
                            value={account.lastName}
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
                            id="account-phoneNumber"
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

export default UpdateAccount

