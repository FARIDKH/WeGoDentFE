import { Box, Grid, Button } from '@material-ui/core'
import AnimateButton from '../../ui-component/extended/AnimateButton'
import PasswordInput from '../../ui-component/Form/PasswordInput'
import * as yup from 'yup'
import { useFormik } from 'formik'
import Input from '../../ui-component/Form/Input'
import { SNACKBAR_OPEN } from '../../store/actions'
import { store } from '../../pages/_app'
import axios from 'axios'

const LoginForm = ({ onSuccess }) => {
    const { errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values } = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: yup.object().shape({
            username: yup.string().required('Username is required'),
            password: yup.string().required('Password is required'),
        }),
        onSubmit: async (values) => {
            try {
                await axios.post('/api/login', values)

                onSuccess?.()
                return
            } catch (e) {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'Email address or password is not correct',
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
                            id="login-email"
                            type="email"
                            value={values.username}
                            name="username"
                            size="medium"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Username / Email Address"
                            error={errors?.username}
                            isTouched={touched?.username}
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
                                Login
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default LoginForm
