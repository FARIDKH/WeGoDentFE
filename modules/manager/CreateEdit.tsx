import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core'
import axios from '../../utils/axios'
import { Formik } from 'formik'
import React from 'react'
import { forwardRef, useState } from 'react'
import { useMutation } from 'react-query'
import useUser from '../../lib/useUser'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import Input from '../../ui-component/Form/Input'
import BlogCategorySelect from '../../ui-component/Form/selects/BlogCategorySelect'
import { useOpenState } from '../../ui-component/hooks/useOpenState'

interface IProps {
    onSuccess?: () => void
}

const CreateEditForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { user } = useUser()
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)

    const { isLoading, mutate } = useMutation(
        (values: any) => (data?.id ? axios.put(`/api/account/${data?.id}`, values) : axios.post('/api/account', values)),
        
        {
            
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.id ? 'User has been updated successfully' : 'User has been created successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })

                handleClose()
                onSuccess()
            },
            onError: (err) => {
                console.log(err)
            }
        }
    )

    

    const handleClose = () => {
        setData(null)
        close()
    }

    const handleOpen = (data = null) => {
        data && setData(data)
        open()
    }

    React.useImperativeHandle(
        ref,
        () => ({
            open: handleOpen,
        }),
        []
    )

    
    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30%', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
            <Formik
                initialValues={{
                    username: data?.username ?? '',
                    firstName: data?.firstName ?? '',
                    lastName: data?.lastName ?? '',
                    password: '',
                    email: data?.email ?? '',
                    phoneNumber: data?.phoneNumber ?? '',
                }}
                onSubmit={(values) => {
                    const payload = {
                        username: values.username,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        password: values.password,
                        email: values.email,
                        roleIds: [5],  // set to manager role id
                        phoneNumber: values.phoneNumber,
                    };
                    mutate(payload);
                  }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <DialogTitle>
                        <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.id ? 'Update' : 'Create'} User</span>
                    </DialogTitle>
                    <DialogContent dividers>

                        <Input
                            id="username"
                            label="Username"
                            name="username"
                            isTouched={touched.username}
                            error={errors.username}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isLoading}
                            value={values?.username}
                        />

                        <Input
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            isTouched={touched.firstName}
                            error={errors.firstName}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isLoading}
                            value={values?.firstName}
                        />

                        <Input
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            isTouched={touched.lastName}
                            error={errors.lastName}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isLoading}
                            value={values?.lastName}
                        />

                        <Input
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            isTouched={touched.password}
                            error={errors.password}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isLoading}
                            value={values?.password}
                        />

                        <Input
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            isTouched={touched.email}
                            error={errors.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isLoading}
                            value={values?.email}
                        />

                        <Input
                            id="phoneNumber"
                            label="Phone Number"
                            name="phoneNumber"
                            isTouched={touched.phoneNumber}
                            error={errors.phoneNumber}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isLoading}
                            value={values?.phoneNumber}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button disableElevation disabled={isLoading} onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            disableElevation
                            disabled={isLoading}
                            size="large"
                            type="submit"
                            variant="contained"
                            color="secondary"
                            style={{ margin: '0 10px' }}
                        >
                            Submit
                            {isLoading && <CircularProgress size={20}  />}
                        </Button>
                    </DialogActions>
                </form>
            )}

            </Formik>
        </Dialog>
    )
    

})

export default CreateEditForm
