import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import React from 'react'
import { forwardRef } from 'react'
import { useMutation } from 'react-query'
import useUser from '../../lib/useUser'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import axios from '../../utils/axios'

import { Formik } from 'formik'
import Input from '../../ui-component/Form/Input'
import * as yup from 'yup'

interface IProps {
    onSuccess?: () => void
}

const UserDetailFormModal = forwardRef(({ onSuccess }: IProps, ref) => {
    const { info: patientInfo } = useUser(false)

    const { isOpen, open, close } = useOpenState()

    const { mutate, isLoading: isSubmitting } = useMutation(
        async (values: any) => {
            const newValues = {
                ...patientInfo,
                userDTO: { ...patientInfo.userDTO, ...values },
            }
            return await axios.patch(`/api/patient/${patientInfo?.id}`, newValues)
        },
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'Your information has been saved successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })

                close()
                onSuccess?.()
            },
        }
    )

    React.useImperativeHandle(
        ref,
        () => ({
            open,
        }),
        []
    )

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30rem', maxHeight: 600 } }} maxWidth="lg" open={isOpen} onBackdropClick={close}>
            <DialogTitle
                sx={{
                    textAlign: 'center',
                }}
            >
                <span style={{ fontSize: 22, fontWeight: 'bold' }}>Please fill your information</span>
            </DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{
                        firstName: patientInfo?.userDTO?.firstName ?? '',
                        lastName: patientInfo?.userDTO?.lastName ?? '',
                        phoneNumber: patientInfo?.userDTO?.phoneNumber ?? '',
                    }}
                    validationSchema={yup.object({
                        firstName: yup.string().required('First Name is required'),
                        lastName: yup.string().required('Last Name is required'),
                        phoneNumber: yup.string().required('Phone Number is required'),
                    })}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
                                    />

                                    <Button
                                        disableElevation
                                        disabled={isSubmitting}
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        style={{ margin: '0 10px' }}
                                    >
                                        Save
                                        {isSubmitting && <CircularProgress size={20} />}
                                    </Button>
                                </Box>
                            </form>
                        )
                    }}
                </Formik>
            </DialogContent>
        </Dialog>
    )
})

export default UserDetailFormModal
