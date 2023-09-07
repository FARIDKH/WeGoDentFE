import { useManager } from '../../../hooks/useManager'
import Select from '../Select'

interface IProps {
    name: string
    value: any
    onChange: any
    disabled?: boolean
    isTouched?: boolean
    onBlur: any
    error: string
    [key: string]: any
}

const ManagerSelect = ({  name, isTouched, error, onBlur, onChange, value, disabled }: IProps) => {
    const { data: managers, isFetching: isManagerFetching } = useManager()
    // console.log(managers.data)
    return (
        <Select
            id="manager"
            label="Manager"
            name={name}
            isTouched={isTouched}
            error={error}
            onBlur={onBlur}
            onChange={onChange}
            disabled={disabled || isManagerFetching }
            value={value}
            data={managers?.data?.map((item) => ({
                label: `${item?.username}`,
                value: item?.id,
            }))}
        />
    )
}

export default ManagerSelect
