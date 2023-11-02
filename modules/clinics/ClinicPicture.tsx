import { useState, useEffect } from 'react'
import { storage } from '../../utils/firebase' // assuming this is where you have your Firebase initialized
import { ref, getDownloadURL } from 'firebase/storage'
import avatar from '../../assets/images/avatar-clinic.png'

const ClinicPicture = ({ file = null, clinic = null, ...rest }) => {
    const [imageUrl, setImageUrl] = useState(avatar?.src)

    useEffect(() => {
        if (file) {
            // If there's a new file selected, create a local URL for it
            setImageUrl(URL.createObjectURL(file))
        } else if (clinic?.clinicId) {
            // If no new file is selected but a clinic ID exists, fetch the image from Firebase
            const imageRef = ref(storage, `clinic/${clinic.clinicId}/profile-picture`)
            getDownloadURL(imageRef)
                .then((url) => {
                    setImageUrl(url)
                })
                .catch((error) => {
                    // handle any errors here
                    console.error('Error fetching image from Firebase Storage:', error)
                    setImageUrl(avatar?.src)
                })
        }
    }, [file, clinic])

    return (
        <img
            src={imageUrl}
            alt={clinic?.name || 'Clinic'}
            style={{ borderRadius: '50%', width: '100%', height: '100%', objectFit: 'cover' }}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null // prevents looping
                currentTarget.src = avatar?.src
            }}
            {...rest}
        />
    )
}

export default ClinicPicture
