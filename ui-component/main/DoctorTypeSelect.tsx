import { MenuItem, Select } from '@material-ui/core'
import { ENUM_DOCTOR_TYPES } from '../../hooks/useDoctors'

const DoctorTypeSelect = ({ value, handleChange, ...rest }) => {
    return (
        <Select name="doctorType" value={value} onChange={handleChange} {...rest}>
            {Object.values(ENUM_DOCTOR_TYPES).map((item) => (
                <MenuItem key={item} value={item}>
                    {item?.replace(/_/g, ' ')}
                </MenuItem>
            ))}
        </Select>
    )
}

export default DoctorTypeSelect
