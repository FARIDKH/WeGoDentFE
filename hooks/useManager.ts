import { useQuery } from 'react-query'
import useUser from '../lib/useUser'
import axios from '../utils/axios'

export const useManager = (enabled = true, params = null) => {
    const { info } = useUser()

    return useQuery(
        ['AllUsers'],
        async ({ signal }) => {
            const result = await axios(`/api/allUsers`, { signal })
            console.log("allUsers")
            console.log(result.data)
            return result.data
        },
        {
            initialData: [],
            enabled: enabled,
            ...params,
        }
    )
}
