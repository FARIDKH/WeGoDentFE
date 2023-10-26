import { apiUrl } from '../../lib/fetchJson'
import avatar from '../../assets/images/avatar-clinic.png'

const ClinicPicture = ({ file = null, clinic = null, ...rest }) => {
    const imageUrl = file ? URL.createObjectURL(file) : `${apiUrl}/clinics/${clinic?.clinicId}/profile-picture`

    return (
        <img
            src={imageUrl}
            alt={clinic?.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null // prevents looping
                currentTarget.src = avatar?.src
            }}
            {...rest}
        />
    )
}

export default ClinicPicture
