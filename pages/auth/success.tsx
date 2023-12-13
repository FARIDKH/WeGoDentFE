// pages/success.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Success = () => {
    const router = useRouter()
    const { token } = router.query

    useEffect(() => {
        const sendTokenToServer = async () => {
            if (typeof window !== 'undefined' && token) {
                const response = await fetch('/api/oauth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                })

                if (response.ok) {
                    alert('Auth successful, please close this window.')
                    localStorage.setItem('refetch_user', 'true')
                    window.close()
                } else {
                    // Handle error
                    console.error('Failed to save token')
                }
            }
        }

        sendTokenToServer()
    }, [token])

    return <div>Processing authentication...</div>
}

export default Success
