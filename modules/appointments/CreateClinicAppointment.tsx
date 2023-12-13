import { Box, Button, Dialog, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import dayjs from 'dayjs'
import React, { useEffect, useRef } from 'react'
import { forwardRef, useState } from 'react'
import { useMutation } from 'react-query'
import useUser from '../../lib/useUser'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import axios from '../../utils/axios'
import { ENUM_APPOINTMENT_STATUSES } from '../appointments/constants'
import LoginForm from '../auth/LoginForm'
import CreatePatient from '../main/appointments/CreatePatient'
import Loading from '../../ui-component/Loading'
import GoogleAuthButton from '../../ui-component/auth/GoogleAuthButton'
import UserDetailFormModal from '../../ui-component/auth/UserDetailFormModal'

interface IProps {
    onSuccess?: () => void
    onClose?: () => void
}

const CreateClinicAppointment = forwardRef(({ onSuccess, onClose }: IProps, ref) => {
    const [isLoginStep, setLoginStep] = useState(true)
    const { isLoading, isLoggedIn, info, refetch: refetchUser } = useUser(false)
    const userDetailFormModalRef = useRef(null)

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

    const { mutate: createAppointment, isLoading: isCreatingAppointment } = useMutation(
        async () => {
            const day = dayjs(data?.day).format('YYYY-MM-DD')
            const time = dayjs(data?.time)
            const startTime = time.format('THH:mm:ss.000[Z]')
            const endTime = time.add(1, 'h').format('THH:mm:ss.000[Z]')

            const startDate = `${day}${startTime}`
            const endDate = `${day}${endTime}`

            const requestBody = {
                status: ENUM_APPOINTMENT_STATUSES.REQUESTED,
                clinicId: data?.clinicId,
                patientId: info?.id,
                appointmentStart: startDate,
                appointmentEnd: endDate,
            }

            return await axios.post(`/api/appointment/clinic`, requestBody)
        },
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'Appointment has been created successfully',
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
        handleClose()
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

    useEffect(() => {
        if (!isOpen || !isLoggedIn) return

        if (!info?.userDTO?.phoneNumber) {
            userDetailFormModalRef?.current?.open()
        } else if (data) {
            createAppointment()
        }
    }, [isOpen, data, isLoggedIn])

    const onUserDetailFormSuccess = () => {
        refetchUser()
        createAppointment()
    }

    React.useImperativeHandle(
        ref,
        () => ({
            open: handleOpen,
        }),
        []
    )

    return (
        <>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '30rem', maxHeight: 600 } }}
                maxWidth="lg"
                open={isOpen}
                onBackdropClick={handleClose}
            >
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    <span style={{ fontSize: 22, fontWeight: 'bold' }}>
                        {data?.clinicIsSubscribed ? 'Make an Appointment' : 'Preview clinic phone number'}{' '}
                    </span>
                </DialogTitle>
                <DialogContent>
                    {isLoading || isCreatingAppointment ? (
                        <Loading size={60} />
                    ) : (
                        <>
                            {isLoginStep ? (
                                <LoginForm onSuccess={() => (data?.clinicIsSubscribed ? createAppointment() : handleClinicClose())} />
                            ) : (
                                <CreatePatient onSuccess={() => setLoginStep(true)} />
                            )}

                            <Divider
                                sx={{
                                    marginY: 2,
                                }}
                            />
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <span>
                                    <Button onClick={() => setLoginStep((prev) => !prev)} variant="outlined" color="secondary">
                                        {isLoginStep ? 'Create new account' : 'Login'}
                                    </Button>
                                </span>

                                <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                    or sign up with
                                    <GoogleAuthButton />
                                </span>
                            </Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <UserDetailFormModal ref={userDetailFormModalRef} onSuccess={onUserDetailFormSuccess} />
        </>
    )
})

export default CreateClinicAppointment
