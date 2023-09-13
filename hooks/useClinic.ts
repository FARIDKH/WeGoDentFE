/* eslint-disable no-unused-vars */
import { useQuery } from 'react-query'
import axios from '../utils/axios'

export const useClinic = ({ id, enabled = true, params = null, checkAuth = true }) => {

    
    
    return useQuery(
        ['Clinic', id],
        async ({ signal }) => {
            const result = await axios(`/api/clinics/${id}`, {
                signal,
                checkAuth,
            })
            return [result.data]
        },
        {
            initialData: [],
            enabled: enabled && id !== undefined,
            ...params,
        }
    )
}

