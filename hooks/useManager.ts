import { useQuery } from 'react-query'
import useUser from '../lib/useUser'
import axios from '../utils/axios'

export const useManager = (enabled = true, params = null) => {
    const { info } = useUser()

    return useQuery(
        ['Managers'],
        async ({ signal }) => {
            const result = await axios(`/api/allUsers`, { signal })
            return result.data.data
        },
        {
            initialData: [],
            enabled: enabled,
            ...params,
        }
    )
}
