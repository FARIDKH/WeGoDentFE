import { useManager } from '../../../hooks/useManager'
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

const ManagerSelect = ({ fetch, name, isTouched, error, onBlur, onChange, value, disabled }: IProps) => {
    const { data: managers, isFetching: isPatientFetching } = useManager(fetch)
    console.log(managers)
    return (
        <Select
            id="manager"
            label="Manager"
            name={name}
            isTouched={isTouched}
            error={error}
            onBlur={onBlur}
            onChange={onChange}
            disabled={disabled || isPatientFetching}
            value={value}
            data={managers?.map((item) => ({
                label: `${item?.firstName} ${item?.lastName}`,
                value: item?.id,
            }))}
        />
    )
}

export default ManagerSelect
