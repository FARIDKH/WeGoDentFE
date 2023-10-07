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
    isAdmin?: boolean;
    currentManagerId?: number | null;
    [key: string]: any
}

const ManagerSelect = ({  name, isTouched, error, onBlur, onChange, value, disabled, isAdmin, currentManagerId, ...otherProps }: IProps) => {
    const { data: managers, isFetching: isManagerFetching } = useManager()
    
    let filteredManagers = managers?.data || [];


    
    if (!isAdmin && currentManagerId) {
        filteredManagers = filteredManagers.filter(manager => manager.id === currentManagerId);
    }
    
    const managerOptions = filteredManagers.map((item) => ({
        label: `${item?.username}`,
        value: item?.id,
    }));

    const finalValue = !isAdmin && currentManagerId ? currentManagerId : value;
    const finalDisabled = !isAdmin || disabled || isManagerFetching;

    


    return (
        <Select
            id="manager"
            label="Manager"
            name={name}
            isTouched={isTouched}
            error={error}
            onBlur={onBlur}
            onChange={(e) => {
                console.log("Selected value:", e.target.value);
                onChange(e.target.value);
            }}
            disabled={finalDisabled}
            value={finalValue}
            data={managerOptions}
        />
    )
}


export default ManagerSelect
