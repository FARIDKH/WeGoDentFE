import { Box, Button, Dialog, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import dayjs from 'dayjs'
import React from 'react'
import { format } from 'date-fns'
import { forwardRef, useState } from 'react'
import { useMutation } from 'react-query'
import { fetchCurrentUser } from '../../lib/useUser'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import axios from '../../utils/axios'
import { ENUM_APPOINTMENT_STATUSES } from '../appointments/constants'
import LoginForm from '../auth/LoginForm'
import CreatePatient from '../main/appointments/CreatePatient'

interface IProps {
    onSuccess?: () => void
    onClose?: () => void
}

const CreateClinicAppointment = forwardRef(({ onSuccess, onClose }: IProps, ref) => {
    const [isLoginStep, setLoginStep] = useState(true)

    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)

    const handleClose = () => {
        setData(null)
        onClose?.()
        setLoginStep(true)
        close()
    }

    const handleOpen = (data = null) => {
        data && setData(data)
        open()
    }

    var resultStartDate = '2021-09-01T10:00:00.000Z'

    const { mutate: createAppointment } = useMutation(
        async () => {
            const day = dayjs(data?.day).format('YYYY-MM-DD')
            const time = dayjs(data?.time)
            const startTime = time.format('THH:mm:ss.000[Z]')
            const endTime = time.add(1, 'h').format('THH:mm:ss.000[Z]')

            const startDate = `${day}${startTime}`
            const endDate = `${day}${endTime}`

            const userData = await fetchCurrentUser()
            console.log(userData);


            const requestBody = {
                status: ENUM_APPOINTMENT_STATUSES.REQUESTED,
                clinicId: data?.clinicId,
                patientId: userData?.id,
                appointmentStart: startDate,
                appointmentEnd: endDate,
            }
            resultStartDate = dayjs(startDate).subtract(1, 'day').format('ddd MMM DD YYYY HH:mm:ss')

            return await axios.post(`/api/appointment/clinic`, requestBody)
        },
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'Appointment has been created successfully at ' + resultStartDate,
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })

                handleClose()
                onSuccess?.()
            },
        }
    )


    const handleClinicClose = () => {
        handleClose();
        store.dispatch({
            type: SNACKBAR_OPEN,
            open: true,
            message: 'You have successfully logged in',
            variant: 'alert',
            alertSeverity: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
        })
        onSuccess?.()
    }


    React.useImperativeHandle(
        ref,
        () => ({
            open: handleOpen,
        }),
        []
    )

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30rem', maxHeight: 600 } }} maxWidth="lg" open={isOpen} onBackdropClick={handleClose}>
            <DialogTitle
                sx={{
                    textAlign: 'center',
                }}
            >
                <span style={{ fontSize: 22, fontWeight: 'bold' }}>{ data?.clinicIsSubscribed ? "Make an Appointment" : "Preview clinic phone number"} </span>
            </DialogTitle>
            <DialogContent>
                {isLoginStep ? <LoginForm onSuccess={() => data?.clinicIsSubscribed ? createAppointment() : handleClinicClose() } /> : <CreatePatient onSuccess={() => setLoginStep(true)} />}

                <Divider
                    sx={{
                        marginY: 2,
                    }}
                />
                <Box display="flex" justifyContent="center">
                    <Button onClick={() => setLoginStep((prev) => !prev)} variant="outlined" color="secondary">
                        {isLoginStep ? 'Create new account' : 'Login'}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    )
})

export default CreateClinicAppointment
