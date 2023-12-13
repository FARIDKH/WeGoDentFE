import { Button } from '@material-ui/core'
import GoogleIcon from '@mui/icons-material/Google'
import { useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

const googleButtonStyle = {
    background: 'linear-gradient(45deg, #4285F4 30%, #34A853 90%)', // Example gradient using Google colors
    color: 'white', // White icon
    marginLeft: '8px',
    // Additional styles (if needed) to make it look more like a Google button
}

const GoogleAuthButton = () => {
    const queryClient = useQueryClient()
    const [isGoogleLogin, setIsGoogleLogin] = useState(false)

    const handleGoogleSignIn = () => {
        setIsGoogleLogin(true)

        let redirect_uri = 'http://localhost:3000/auth/success'
        if (process.env.NODE_ENV === 'production') {
            redirect_uri = 'https://www.wegodent.com/auth/success'
        }
        const googleAuthUrl = 'https://wegodent-service.onrender.com/oauth2/authorize/google?redirect_uri=' + redirect_uri
        window.open(googleAuthUrl, 'width=600,height=700')
    }

    useEffect(() => {
        if (isGoogleLogin) {
            const interval = setInterval(() => {
                const refetchUser = localStorage?.getItem('refetch_user')
                if (refetchUser && refetchUser == 'true') {
                    clearInterval(interval)

                    localStorage.removeItem('refetch_user')
                    queryClient.invalidateQueries(['GetUserDetails'])
                }
            }, 1000)
        }
    }, [isGoogleLogin])

    return (
        <Button onClick={handleGoogleSignIn} variant="outlined" color="secondary" style={googleButtonStyle}>
            <GoogleIcon />
        </Button>
    )
}

export default GoogleAuthButton
