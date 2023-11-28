import { useClinics } from '../../../hooks/useClinics'
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

const ClinicSelect = ({ fetch, name, isTouched, error, onBlur, onChange, value, disabled }: IProps) => {
    const { data: clinics, isFetching: isPatientFetching } = useClinics({ enabled : fetch})
    return (
        <Select
            id="clinicId"
            label="Clinic"
            name={name}
            isTouched={isTouched}
            error={error}
            onBlur={onBlur}
            onChange={onChange}
            disabled={disabled || isPatientFetching}
            value={value}
            data={clinics?.map((item) => ({
                label: `${item?.name}`,
                value: item?.clinicId,
            }))}
        />
    )
}

export default ClinicSelect
