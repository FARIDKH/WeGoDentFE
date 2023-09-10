import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core'
import axios from '../../utils/axios'
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
import TreatmentSelect from '../../ui-component/Form/selects/TreatmentSelect'
import TreatmentPhaseSelect from '../../ui-component/Form/selects/TreatmentPhaseSelect'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import { ENUM_APPOINTMENT_STATUSES } from './constants'

interface IProps {
    onSuccess?: () => void
}

const CreateEditForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isDoctor, isPatient, info } = useUser()

    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)

    const { isLoading, mutate } = useMutation(
        (values: any) => {
            const requestBody = {
                ...values,
                appointmentStart: format(new Date(values?.appointmentStart), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
                appointmentEnd: format(new Date(values?.appointmentEnd), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
            }
            const requestTreatmentSessionBody = {
                status: 'SCHEDULED',
                doctorId: values?.doctor_id,
                patientId: values?.patient_id,
                appointmentStart: format(new Date(values?.appointmentStart), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
                appointmentEnd: format(new Date(values?.appointmentEnd), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
            }
            if (
                values?.appointmentStatus === ENUM_APPOINTMENT_STATUSES.REJECTED ||
                values?.appointmentStatus === ENUM_APPOINTMENT_STATUSES.CANCELLED ||
                values?.appointmentStatus === ENUM_APPOINTMENT_STATUSES.COMPLETED
            ) {
                return axios.put(`/api/appointment/${data?.id}`, requestBody)
            }
            console.log(values)
            return data?.id
                ? axios.put(
                      `/api/doctor/appointment/${data?.id}/treatment-phase/${values?.treatment_phase_id}`,
                      requestTreatmentSessionBody
                  )
                : axios.put(`/api/doctor/treatment-phase/${values?.treatment_phase_id}`, requestTreatmentSessionBody)
        },
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.id ? 'Appointment has been updated successsfully' : 'Appointment has been created successfully',
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
    const treatmentId: any = ''
    const treatmentPhaseId: any = ''

    const statuses = isPatient
        ? [ENUM_APPOINTMENT_STATUSES.REQUESTED, ENUM_APPOINTMENT_STATUSES.CANCELLED]
        : Object.keys(ENUM_APPOINTMENT_STATUSES)

    const [selectedTreatment, setSelectedTreatment] = useState(null)

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30rem', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
            <Formik
                initialValues={{
                    appointmentStart: data?.appointmentStart ?? '',
                    appointmentEnd: data?.appointmentEnd ?? '',
                    appointmentStatus: data?.status ?? ENUM_APPOINTMENT_STATUSES.REQUESTED,
                    isDoctor,
                    doctor_id: doctorId ?? (isDoctor ? info?.id : ''),
                    doctorType: data?.doctorDTO?.doctorType ?? '',
                    officeLocation: data?.doctorDTO?.officeLocationName ?? '',
                    patient_id: patientId ?? (isPatient ? info?.id : ''),
                    treatment_id: treatmentId,
                    treatment_phase_id: treatmentPhaseId,
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
                                {isDoctor && (
                                    <PatientSelect
                                        fetch={isOpen}
                                        name="patient_id"
                                        isTouched={!!touched.patient_id}
                                        error={errors.patient_id as string}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        disabled={patientId || isLoading}
                                        value={values?.patient_id}
                                    />
                                )}
                                {isDoctor && (
                                    <TreatmentSelect
                                        fetch={isOpen}
                                        name="treatment_id"
                                        isTouched={!!touched.treatment_id}
                                        error={errors.treatment_id as string}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        // disabled={treatment_id || isLoading}
                                        value={values?.treatment_id}
                                    />
                                )}

                                {isDoctor && (
                                    <TreatmentPhaseSelect
                                        fetch={isOpen}
                                        name="treatment_phase_id"
                                        treatmentId={values?.treatment_id}
                                        isTouched={!!touched.treatment_phase_id}
                                        error={errors.treatment_phase_id as string}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        // disabled={values?.treatment_id || isLoading}
                                        value={values?.treatment_phase_id}
                                    />
                                )}

                                {isPatient && (
                                    <DoctorSelect fetch={isOpen} form={form} name="doctor_id" disabled={!!doctorId || isLoading} />
                                )}

                                <DateTimePicker
                                    id="appointmentStart"
                                    label="Start Date"
                                    name="appointmentStart"
                                    isTouched={touched.appointmentStart}
                                    error={errors.appointmentStart}
                                    onBlur={handleBlur}
                                    onChange={(val) => setFieldValue('appointmentStart', val)}
                                    disabled={isDoctor}
                                    minDate={new Date()}
                                    value={values?.appointmentStart}
                                />
                                <DateTimePicker
                                    id="appointmentEnd"
                                    label="End Date"
                                    name="appointmentEnd"
                                    isTouched={touched.appointmentEnd}
                                    error={errors.appointmentEnd}
                                    onBlur={handleBlur}
                                    onChange={(val) => setFieldValue('appointmentEnd', val)}
                                    disabled={isDoctor}
                                    minDate={new Date()}
                                    value={values?.appointmentEnd}
                                />

                                {data?.id && (
                                    <Select
                                        id="appointmentStatus"
                                        label="Status"
                                        name="appointmentStatus"
                                        isTouched={touched.appointmentStatus}
                                        error={errors.appointmentStatus}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        value={values?.appointmentStatus}
                                        data={statuses.map((item) => ({
                                            label: item,
                                            value: item,
                                        }))}
                                    />
                                )}
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

export default CreateEditForm
