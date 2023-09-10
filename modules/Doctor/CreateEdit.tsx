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
        (values: any) => (data?.id ? axios.patch(`/api/doctor/${data?.id}`, values) : axios.post('/api/doctor', values)),

        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.id ? 'Doctor has been updated successfully' : 'Doctor has been created successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })

                handleClose()
                onSuccess()
            },
            onError: (err) => {
                console.log(err)
            },
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
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30rem', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
            <Formik
                initialValues={{
                    username: data?.userDTO?.username ?? '',
                    firstName: data?.userDTO?.firstName ?? '',
                    lastName: data?.userDTO?.lastName ?? '',
                    password: '',
                    email: data?.userDTO?.email ?? '',
                    phoneNumber: data?.userDTO?.phoneNumber ?? '',
                    experience: data?.experience ?? '',
                    language: data?.language ?? '',
                    hourlyRate: data?.hourlyRate ?? '',
                    officeLocationName: data?.officeLocationName ?? '',
                }}
                // validationSchema={blogValidationSchema}
                onSubmit={(values) => {
                    const payload = {
                        userDTO: {
                            username: values.username,
                            firstName: values.firstName,
                            lastName: values.lastName,
                            password: values.password,
                            email: values.email,
                            roleIds: [0], // you need to determine how to handle this part
                            phoneNumber: values.phoneNumber,
                        },
                        experience: values.experience,
                        language: values.language,
                        hourlyRate: values.hourlyRate,
                        doctorType: 'General_Dentist', // if this is a fixed value
                        officeLocationName: values.officeLocationName,
                    }
                    mutate(payload)
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <DialogTitle>
                            <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.id ? 'Update' : 'Create'}</span>
                        </DialogTitle>
                        <DialogContent dividers>
                            {/* <BlogCategorySelect
                                name="blogCategoryDTOS"
                                value={values?.blogCategoryDTOS}
                                onChange={(value) => setFieldValue('blogCategoryDTOS', value)}
                                isLoading={isLoading}
                                onBlur={handleBlur}
                                error={errors?.blogCategoryDTOS as string}
                                isTouched={!!touched.blogCategoryDTOS}
                            /> */}

                            <Input
                                id="username"
                                label="username"
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
                                label="firstName"
                                name="firstName"
                                isTouched={touched.firstName}
                                error={errors.firstName}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.firstName}
                                multiline
                                rows={4}
                            />

                            <Input
                                id="lastName"
                                label="lastName"
                                name="lastName"
                                isTouched={touched.lastName}
                                error={errors.lastName}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.lastName}
                                multiline
                                rows={4}
                            />

                            <Input
                                id="password"
                                label="password"
                                name="password"
                                isTouched={touched.password}
                                error={errors.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.password}
                                multiline
                                rows={4}
                            />

                            <Input
                                id="email"
                                label="email"
                                name="email"
                                isTouched={touched.email}
                                error={errors.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.email}
                                multiline
                                rows={4}
                            />

                            <Input
                                id="phoneNumber"
                                label="phoneNumber"
                                name="phoneNumber"
                                isTouched={touched.phoneNumber}
                                error={errors.phoneNumber}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.phoneNumber}
                                multiline
                                rows={4}
                            />

                            <Input
                                id="experience"
                                label="experience"
                                name="experience"
                                isTouched={touched.experience}
                                error={errors.experience}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.experience}
                                multiline
                                rows={4}
                            />

                            <Input
                                id="hourlyRate"
                                label="hourlyRate"
                                name="hourlyRate"
                                isTouched={touched.hourlyRate}
                                error={errors.hourlyRate}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.hourlyRate}
                                multiline
                                rows={4}
                            />

                            <Input
                                id="language"
                                label="language"
                                name="language"
                                isTouched={touched.language}
                                error={errors.language}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.language}
                                multiline
                                rows={4}
                            />

                            <Input
                                id="officeLocationName"
                                label="officeLocationName"
                                name="officeLocationName"
                                isTouched={touched.officeLocationName}
                                error={errors.officeLocationName}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.officeLocationName}
                                multiline
                                rows={4}
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
                                {isLoading && <CircularProgress size={20} />}
                            </Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    )
})

export default CreateEditForm
