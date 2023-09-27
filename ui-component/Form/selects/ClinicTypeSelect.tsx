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
const specialties = [
    "General_Dentist",
    "Orthodontist",
    "Periodontist",
    "Endodontist",
    "Oral_and_Maxillofacial_Surgeon",
    "Pediatric_Dentist",
    "Prosthodontist",
    "Oral_Pathologist",
    "Oral_Medicine_Specialist",
    "Cosmetic_Dentist",
    "Emergency_Dentist"
  ];
// const dentalSpecialties = specialties.map(specialty => ({ id: specialty, name: specialty }));
const ClinicTypeSelect = ({
    label = 'ClinicType',
    id = 'clinicType',
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
        ['ClinicTypes'],
        async ({ signal }) => {
            // const result = await axios(`/api/blogcategory`, { signal })
            return specialties
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
            getOptionLabel={(option) => option}
            getOptionSelected={(option, value) => option === value} // <-- directly compare option and value
            data={data} // <-- use "options" prop instead of "data"
        
            loading={isLoading || isFetching}
            {...rest}
        />
    )
}

export default ClinicTypeSelect
