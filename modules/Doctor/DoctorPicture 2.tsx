import { apiUrl } from '../../lib/fetchJson'
import avatar from '../../assets/images/avatar.png'

const DoctorPicture = ({ file = null, doctor = null, ...rest }) => {
    const imageUrl = file ? URL.createObjectURL(file) : `${apiUrl}/doctor/${doctor?.id}/profile-picture`

    return (
        <img
            src={imageUrl}
            alt={doctor?.userDTO?.email}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null // prevents looping
                currentTarget.src = avatar?.src
            }}
            {...rest}
        />
    )
}

export default DoctorPicture
