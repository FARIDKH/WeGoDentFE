import { useTreatmentPhases } from '../../../hooks/useTreatmentPhases'
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
    [key: string]: any,
    treatmentId : any
}

const TreatmentPhaseSelect = ({ fetch, name, isTouched, error, onBlur, onChange, value, disabled, treatmentId }: IProps) => {
    const { data: treatmentPhases, isFetching: isPatientFetching } = useTreatmentPhases(treatmentId, fetch)
    
    return (
        <Select
            id="treatmentPhases"
            label="Treatment Phases"
            name={name}
            isTouched={isTouched}
            error={error}
            onBlur={onBlur}
            onChange={onChange}
            disabled={disabled || isPatientFetching}
            value={value}
            data={treatmentPhases?.map((item) => ({
                label: `${item?.name}`,
                value: item?.id,
            }))}
        />
    )
}

export default TreatmentPhaseSelect
