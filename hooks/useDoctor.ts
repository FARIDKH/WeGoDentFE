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

// export const useDoctor = ({ id, enabled = true, params = null, checkAuth = true }) => {

//     // if (!id) {
//     //     return { data: null, isFetching: false };
//     //   }
    
//     return useQuery(
//         ['Doctor'],
//         async ({ signal }) => {
//             const result = await axios(`/api/doctor/${id}`, {
//                 signal,
//                 checkAuth,
//             })
//             return [result.data]
//         },
//         {
//             initialData: [],
//             enabled: true,
//             ...params,
//         }
//     )
// }

export const useDoctor = ({ id, enabled = true, params = null, checkAuth = true }) => {
    const fetchDoctor = async ({ signal }) => {
        const result = await axios(`/api/doctor/${id}`, {
            signal,
            checkAuth,
        })
        return [result.data]
    }

    return useQuery(
        ['Doctor', id], // Also include id as part of the query key
        fetchDoctor,
        {
            initialData: [],
            enabled: enabled && id !== undefined, // only enable query if id is not undefined
            ...params,
        }
    )
}
