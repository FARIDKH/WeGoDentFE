import { useDoctorPatients } from '../../../hooks/usePatient'
import Select from '../Select'

interface IProps {
    fetch: boolean
    name: string
    value: any
    onChange: any
    disabled?: boolean
    isTouched?: boolean
    onBlur: any
    error: string
    [key: string]: any
}

const PatientSelect = ({ fetch, name, isTouched, error, onBlur, onChange, value, disabled }: IProps) => {
    const { data: patients, isFetching: isPatientFetching } = useDoctorPatients(fetch)

    return (
        <Select
            id="patient"
            label="Patient"
            name={name}
            isTouched={isTouched}
            error={error}
            onBlur={onBlur}
            onChange={onChange}
            disabled={disabled || isPatientFetching}
            value={value}
            data={patients?.map((item) => ({
                label: `${item?.userDTO?.firstName} ${item?.userDTO?.lastName}`,
                value: item?.id,
            }))}
        />
    )
}

export default PatientSelect
