/* eslint-disable no-unused-vars */
import { useQuery } from 'react-query'
import axios from '../utils/axios'



export const useClinics = ({  enabled = true, params = null, checkAuth = true }) => {
    return useQuery(
        ['Clinics'],
        async ({ signal }) => {
            const result = await axios(`/api/clinics`, {
                params: {   },
                signal,
                checkAuth,
            })
            return result.data
        },
        {
            initialData: [],
            enabled: enabled,
            ...params,
        }
    )
}
