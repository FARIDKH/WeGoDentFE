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
import GoogleIcon from '@mui/icons-material/Google';

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

    const googleButtonStyle = {
        background: 'linear-gradient(45deg, #4285F4 30%, #34A853 90%)', // Example gradient using Google colors
        color: 'white', // White icon
        marginLeft: '8px',
        // Additional styles (if needed) to make it look more like a Google button
    };
    

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

    const handleGoogleSignIn = () => {
        const googleAuthUrl = 'https://wegodent-service.onrender.com/oauth2/authorize/google?redirect_uri=http://localhost:3000/auth/success';
        const authWindow = window.open(googleAuthUrl, 'width=600,height=700');
    
        const checkAuthInterval = setInterval(() => {
            const jwtCookie = getCookie('jwt'); // Assuming 'jwt' is the name of your cookie
            
            if (jwtCookie) {
                clearInterval(checkAuthInterval);
                authWindow.close(); // Close the popup if still open
    
                // Use the JWT token to fetch user data or perform other actions
                fetchCurrentUser().then(userData => {
                    if (userData) {
                        handleClinicClose();
                    }
                });
            } else {
                console.log("jwt not found")
            }
        }, 1000);
    };
    
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
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
                <Box display="flex" justifyContent="center" alignItems="center">
                    <span>
                        <Button onClick={() => setLoginStep((prev) => !prev)} variant="outlined" color="secondary">
                            {isLoginStep ? 'Create new account' : 'Login'}
                        </Button>
                    </span>

                    <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
                        or sign up with 
                        <Button onClick={handleGoogleSignIn} variant="outlined" color="secondary" style={googleButtonStyle}>
                            <GoogleIcon />
                        </Button>
                    </span>
                </Box>
                                
            </DialogContent>
        </Dialog>
    )
})

export default CreateClinicAppointment
