import { Box, SelectProps, TextField, TextFieldProps } from '@material-ui/core'
import IconSelect from '@material-ui/icons/ExpandMore'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { ENUM_DOCTOR_TYPES } from '../../hooks/useDoctor'
import DoctorTypeSelect from '../../ui-component/main/DoctorTypeSelect'

interface IProps {
    selectProps?: SelectProps
    inputProps?: TextFieldProps
    // eslint-disable-next-line no-unused-vars
    searchButton: ReactNode
    classNames: {
        wrapper: string
        doctorSelect: string
        locationInput: string
    }
}

const SearchForm = ({ selectProps, inputProps, searchButton, classNames }: IProps) => {
    const { query, push, locale } = useRouter()

    return (
        <Formik
            enableReinitialize
            initialValues={{
                doctorType: (query?.doctorType ?? ENUM_DOCTOR_TYPES.General_Dentist) as string,
                officeLocation: query?.officeLocation ?? "" as string,
            }}
            onSubmit={(values) => {
                if (values?.doctorType && values?.officeLocation)
                    push(
                        {
                            pathname: '/clinics',
                            query: values,
                        },
                        null,
                        {
                            locale,
                        }
                    )
            }}
        >
            {({ handleSubmit, values, handleChange }) => (
                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Box className={classNames.wrapper}>
                        <DoctorTypeSelect
                            className={classNames.doctorSelect}
                            name="doctorType"
                            value={values?.doctorType}
                            variant="outlined"
                            IconComponent={() => <IconSelect />}
                            handleChange={handleChange}
                            {...selectProps}
                        />

                        <TextField
                            className={classNames.locationInput}
                            name="officeLocation"
                            value={values?.officeLocation}
                            onChange={handleChange}
                            placeholder="Budapest I. Kerulet"
                            variant="outlined"
                            InputProps={{
                                endAdornment: searchButton,
                            }}
                            {...inputProps}
                        />
                    </Box>
                </form>
            )}
        </Formik>
    )
}

export default SearchForm
