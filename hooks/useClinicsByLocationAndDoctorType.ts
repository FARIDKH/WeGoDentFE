/* eslint-disable no-unused-vars */
import { useQuery } from 'react-query'
import axios from '../utils/axios'

export enum ENUM_DOCTOR_TYPES {
    General_Dentist = 'General_Dentist',
    Orthodontist = 'Orthodontist',
    Periodontist = 'Periodontist',
    Endodontist = 'Endodontist',
    Oral_and_Maxillofacial_Surgeon = 'Oral_and_Maxillofacial_Surgeon',
    Pediatric_Dentist = 'Pediatric_Dentist',
    Prosthodontist = 'Prosthodontist',
    Oral_Pathologist = 'Oral_Pathologist',
    Oral_Medicine_Specialist = 'Oral_Medicine_Specialist',
    Cosmetic_Dentist = 'Cosmetic_Dentist',
    Emergency_Dentist = 'Emergency_Dentist',
}

export const useClinicsByLocationAndDoctorType = ({ doctorType, officeLocation, enabled = true, params = null, checkAuth = true }) => {
    return useQuery(
        ['ClinicsByDoctorTypeAndLocation', doctorType, officeLocation],
        async ({ signal }) => {
            const result = await axios(`/api/clinics`, {
                params: { doctorType, officeLocation },
                signal,
                checkAuth,
            })
            return result.data
        },
        {
            initialData: [],
            enabled: !!doctorType && !!officeLocation && enabled,
            ...params,
        }
    )
}
