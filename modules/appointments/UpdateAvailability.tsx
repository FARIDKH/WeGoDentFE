import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core'
import { format } from 'date-fns'
import { Formik } from 'formik'
import React from 'react'
import { forwardRef, useState } from 'react'
import { useMutation } from 'react-query'
import useUser from '../../lib/useUser'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import DateTimePicker from '../../ui-component/Form/DateTimePicker'
import Select from '../../ui-component/Form/Select'
import DoctorSelect from '../../ui-component/Form/selects/DoctorSelect'
import PatientSelect from '../../ui-component/Form/selects/PatientSelect'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import { ENUM_APPOINTMENT_STATUSES } from './constants'
import axios from '../../utils/axios'

interface IProps {
    onSuccess?: () => void
}

const UpdateAvailability = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isDoctor, isPatient, info } = useUser()

    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)

    const { isLoading, mutate } = useMutation(
        (values: any) => {
            const requestBody = {
                ...values,
                timeSlotStart: format(new Date(values?.timeSlotStart), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
                timeSlotEnd: format(new Date(values?.timeSlotEnd), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
            }

            return data?.id ? axios.put(`/api/doctor/${info?.id}/availability`, requestBody) : axios.post(`/api/doctor/${info?.id}/availability`, requestBody)
        },
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.id ? 'Availability has been updated successfully' : 'Availability has been created successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })

                handleClose()
                onSuccess()
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

    const doctorId = data?.doctorDTO?.id
    const patientId = data?.patientDTO?.id

    const statuses = isPatient
        ? [ENUM_APPOINTMENT_STATUSES.REQUESTED, ENUM_APPOINTMENT_STATUSES.CANCELLED]
        : Object.keys(ENUM_APPOINTMENT_STATUSES)

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30%', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
            <Formik
                initialValues={{
                    timeSlotStart: data?.timeSlotStart ?? '',
                    timeSlotEnd: data?.timeSlotEnd ?? ''
                }}
                // validationSchema={blogValidationSchema}
                onSubmit={(values) => mutate(values)}
            >
                {(form) => {
                    const { errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue } = form
                    return (
                        <form noValidate onSubmit={handleSubmit}>
                            <DialogTitle>
                                <span style={{ fontSize: 18, fontWeight: 'bold' }}>{data?.id ? 'Update' : 'Create'}</span>                                                                   
                            </DialogTitle>
                            <DialogContent dividers>

                                
                                
                                <DateTimePicker
                                    id="timeSlotStart"
                                    label="Start Date"
                                    name="timeSlotStart"
                                    isTouched={touched.timeSlotStart}
                                    error={errors.timeSlotStart}
                                    onBlur={handleBlur}
                                    onChange={(val) => setFieldValue('timeSlotStart', val)}
                                    disabled={isDoctor}
                                    minDate={new Date()}
                                    value={values?.timeSlotStart}
                                />

                                <DateTimePicker
                                    id="timeSlotEnd"
                                    label="End Date"
                                    name="timeSlotEnd"
                                    isTouched={touched.timeSlotEnd}
                                    error={errors.timeSlotEnd}
                                    onBlur={handleBlur}
                                    onChange={(val) => setFieldValue('timeSlotEnd', val)}
                                    disabled={isDoctor}
                                    minDate={new Date()}
                                    value={values?.timeSlotEnd}
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
                    )
                }}
            </Formik>
        </Dialog>
    )
})

export default UpdateAvailability
