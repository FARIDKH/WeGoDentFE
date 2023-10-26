/* eslint-disable no-unused-vars */
import { useQuery } from 'react-query'
import axios from '../utils/axios'

export const useClinicByName = ({ name, enabled = true, params = null, checkAuth = true }) => {

    
    
    return useQuery(
        ['ClinicByName', name],
        async ({ signal }) => {
            const result = await axios(`/api/clinics/name/${name}`, {
                signal,
                checkAuth,
            })
            return result.data
        },
        {
            initialData: [],
            enabled: enabled && name !== undefined,
            ...params,
        }
    )
}

