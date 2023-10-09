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

const RoleSelect = ({
    label = 'Role',
    id = 'role',
    name,
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
        ['Roles'],
        async ({ signal }) => {
            return  ["ROLE_ADMIN", "ROLE_BLOGGER", "ROLE_MANAGER","ROLE_PATIENT","ROLE_RECEPTIONIST","ROLE_DOCTOR", "ROLE_NURSE"]
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
            getOptionLabel={(option) => option}  // Use the option itself as label since it's a string
            getOptionSelected={(option, value) => option === value}  // Compare strings directly
            data={data}  // Use 'options' prop instead of 'data' for Autocomplete
            loading={isLoading || isFetching}
            {...rest}
        />
    )
}

export default RoleSelect
