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

    const managerOptions = managers?.data 
        ? managers.data.map((item) => ({
            label: `${item?.username}`,
            value: item?.id,
          }))
        : [];
    
//     console.log("ManagerSelect value:", value);
    console.log("Manager options:", managerOptions);


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
            data={managerOptions}
        />
    )
}


export default ManagerSelect
