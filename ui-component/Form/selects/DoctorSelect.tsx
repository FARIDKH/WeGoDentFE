import { FormikProps } from 'formik'
import { ENUM_DOCTOR_TYPES, useDoctors } from '../../../hooks/useDoctors'
import Input from '../Input'
import Select from '../Select'

interface IProps {
    fetch: boolean
    form: FormikProps<any>
    name: string
    disabled: boolean
    [key: string]: any
}

const DoctorSelect = ({ fetch, form, name, disabled }: IProps) => {
    const { errors, handleBlur, handleChange, touched, values } = form
    const { doctorType, officeLocation } = values

    const { data: doctors, isFetching: isPatientFetching } = useDoctors({ doctorType, officeLocation, enabled: fetch })

    return (
        <>
            <Select
                id="doctorType"
                label="Doctor Type"
                name="doctorType"
                isTouched={touched?.doctorType}
                error={errors?.doctorType}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={disabled || isPatientFetching}
                value={doctorType}
                data={Object.values(ENUM_DOCTOR_TYPES).map((value) => ({
                    label: value?.replaceAll('_', ' '),
                    value,
                }))}
            />

            <Input
                id="officeLocation"
                label="Office Location"
                name="officeLocation"
                isTouched={touched.officeLocation}
                error={errors.officeLocation}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={disabled}
                value={officeLocation}
            />

            <Select
                id="patient"
                label="Doctor"
                name={name}
                isTouched={touched?.[name]}
                error={errors?.[name]}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={disabled || isPatientFetching || !doctorType || !officeLocation}
                value={values?.[name]}
                data={doctors?.map((item) => ({
                    label: `${item?.user?.firstName} ${item?.user?.lastName}`,
                    value: item?.id,
                }))}
            />
        </>
    )
}

export default DoctorSelect
