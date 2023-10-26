import { Box, SelectProps, TextField, TextFieldProps } from '@material-ui/core'
import IconSelect from '@material-ui/icons/ExpandMore'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import React, { useState } from 'react'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { ENUM_DOCTOR_TYPES } from '../../hooks/useDoctor'
import DoctorTypeSelect from '../../ui-component/main/DoctorTypeSelect'

interface IProps {
    selectProps?: SelectProps
    inputProps?: TextFieldProps
    curLang?: String,
    // eslint-disable-next-line no-unused-vars
    searchButton: ReactNode
    classNames: {
        wrapper: string
        doctorSelect: string
        locationInput: string
    }
}

const SearchForm = ({ selectProps, curLang, inputProps, searchButton, classNames }: IProps) => {
    const { query, push, locale } = useRouter()
    const [loading, setLoading] = useState(false)

    const [coordinates, setCoordinates] = React.useState(null)
    const [location, setLocation] = useState(query?.officeLocation ?? '')

    const setCurrentLocation = async (setFieldValue, currentLocationValue) => {
        if (navigator.geolocation) {
            setLoading(true)

            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude
                const lng = position.coords.longitude

                try {
                    const address = await fetchAddressFromCoordinates(lat, lng)

                    // Only update the value if it hasn't been manually set.
                    if (!currentLocationValue) {
                        setFieldValue('officeLocation', address)
                    }
                } catch (error) {
                    console.error('Failed to fetch address:', error)
                } finally {
                    setLoading(false)
                }
            })
        } else {
            console.error('Geolocation is not supported by this browser.')
        }
    }

    const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
        const apiKey = 'AIzaSyBYvpPFBUtqr8Tw3YIZ4tGXor_ZjQr1qZc' // Remember to replace with your key!
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`

        const response = await fetch(apiUrl)
        const data = await response.json()

        console.log(data.results[0].formatted_address)
        return data.results[0].formatted_address // Take the first result
    }

    return (
        <Formik
            enableReinitialize
            initialValues={{
                doctorType: (query?.doctorType ?? ENUM_DOCTOR_TYPES.General_Dentist) as string,
                officeLocation: query?.officeLocation ?? ('' as string),
            }}
            onSubmit={(values) => {
                if (values?.doctorType && values?.officeLocation) {
                    const searchQuery = coordinates ? { ...values, ...coordinates } : values

                    push(
                        {
                            pathname: '/clinics',
                            query: searchQuery,
                        },
                        null,
                        {
                            locale,
                        }
                    )
                }
            }}
        >
            {({ handleSubmit, values, handleChange, setFieldValue }) => (
                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Box className={classNames.wrapper}>
                        <DoctorTypeSelect
                            curLang={curLang}
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
                            onChange={(e) => {
                                setLocation(e.target.value)
                                setFieldValue('officeLocation', e.target.value)
                            }}
                            placeholder={loading ? 'Calculating location..' : 'Budapest I. Kerulet'}
                            variant="outlined"
                            disabled={loading}
                            InputProps={{
                                endAdornment: (
                                    <>
                                        <MyLocationIcon
                                            onClick={() => setCurrentLocation(setFieldValue, values?.officeLocation)}
                                            style={{ cursor: 'pointer', color: 'white' }}
                                        />
                                        {searchButton}
                                    </>
                                ),
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
