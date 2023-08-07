import { useDoctorTreatments } from '../../../hooks/useTreatments'
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

const TreatmentSelect = ({ fetch, name, isTouched, error, onBlur, onChange, value, disabled }: IProps) => {
    const { data: treatments, isFetching: isPatientFetching } = useDoctorTreatments(fetch)
    
    return (
        <Select
            id="treatment"
            label="Treatment"
            name={name}
            isTouched={isTouched}
            error={error}
            onBlur={onBlur}
            onChange={onChange}
            disabled={disabled || isPatientFetching}
            value={value}
            data={treatments?.map((item) => ({
                label: `${item?.name}`,
                value: item?.id,
            }))}
        />
    )
}

export default TreatmentSelect
