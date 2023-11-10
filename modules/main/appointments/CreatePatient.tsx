import { Box, Button, CircularProgress, Link } from '@material-ui/core'
import { Formik } from 'formik'
import { useMutation } from 'react-query'
import { store } from '../../../pages/_app'
import { SNACKBAR_OPEN } from '../../../store/actions'
import Input from '../../../ui-component/Form/Input'
import PasswordInput from '../../../ui-component/Form/PasswordInput'
import axios from '../../../utils/axios'

const CreatePatient = ({ onSuccess }) => {
    const { isLoading, mutate } = useMutation(
        (values: any) =>
            axios.post(
                '/api/patient',
                {
                    id: 0,
                    userDTO: { id: 0, ...values, username: values?.email, roleIds: [2] },
                    dateOfBirth: '',
                    allergicReactions: '',
                    specificIllness: '',
                },
                {
                    checkAuth: false,
                }
            ),
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'Your account has been created successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })

                onSuccess?.()
            },
        }
    )

    return (
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                password: '',
            }}
            // validationSchema={blogValidationSchema}
            onSubmit={(values) => mutate(values)}
        >
            {(form) => {
                const { errors, handleBlur, handleChange, handleSubmit, touched, values } = form
                return (
                    <form noValidate onSubmit={handleSubmit}>
                        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                            <Input
                                id="firstName"
                                value={values.firstName}
                                name="firstName"
                                size="medium"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="First Name"
                                error={errors?.firstName}
                                isTouched={touched?.firstName}
                            />

                            <Input
                                id="lastName"
                                value={values.lastName}
                                name="lastName"
                                size="medium"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Last Name"
                                error={errors?.lastName}
                                isTouched={touched?.lastName}
                            />

                            <Input
                                id="email"
                                type="email"
                                value={values.email}
                                name="email"
                                size="medium"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email"
                                error={errors?.email}
                                isTouched={touched?.email}
                            />

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

                            <Input
                                id="phoneNumber"
                                value={values.phoneNumber}
                                name="phoneNumber"
                                size="medium"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Phone Number"
                                error={errors?.phoneNumber}
                                isTouched={touched?.phoneNumber}
                            />
                    <p style={{ color:"gray" }}>
                        By clicking Create, you agree to our <Link target="_blank" href="/terms_and_conditions">Terms</Link>. Learn how we collect, 
                        use and share your data in our <Link href="/privacy_policy" target="_blank">Privacy Policy</Link>. 

                        You may receive e-mail notifications from us and can opt out at any time.


                        </p>
                            <Button
                                disableElevation
                                disabled={isLoading}
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                                style={{ margin: '0 10px' }}
                            >
                                
                                Create
                                {isLoading && <CircularProgress size={20} />}
                            </Button>
                        </Box>
                        
                    </form>
                    
                )
            }}
        </Formik>
    )
}

export default CreatePatient
