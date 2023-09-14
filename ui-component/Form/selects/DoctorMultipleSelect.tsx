import React from 'react'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import Autocomplete from '../Autocomplete'

interface IProps {
    name: string
    value: any
    onChange: any
    disabled?: boolean
    isLoading: boolean
    isTouched?: boolean
    onBlur: any
    error: string
    [key: string]: any
}

const DoctorMultipleSelect = ({
    label = 'Doctor',
    id = 'doctor',
    username,
    onChange,
    disabled,
    error,
    value,
    isLoading,
    isTouched,
    onBlur,
    ...rest
}: IProps) => {
    const { data, isFetching } = useQuery(
        ['MultipleDoctors'],
        async ({ signal }) => {
            const result = await axios(`/api/doctor`, { signal })
            return result.data
        },
        {
            initialData: [],
        }
    )

    

    return (
        <Autocomplete
            id={id}
            multiple
            name={name}
            value={value}
            onBlur={onBlur}
            onChange={(e, value: any) => {
                onChange(value)
            }}
            label={isFetching ? 'Loading..' : label}
            isTouched={isTouched}
            error={error}
            disabled={isFetching || disabled}
            getOptionLabel={(option) => `${option?.userDTO?.firstName} ${option?.userDTO?.lastName}`}
            getOptionSelected={(option, value) => option?.id === value?.id}
            data={data}
            loading={isLoading || isFetching}
            {...rest}
        />
    )
}

export default DoctorMultipleSelect
