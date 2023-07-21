import { useQuery } from 'react-query'
import useUser from '../lib/useUser'
import axios from '../utils/axios'

export const useDoctorPatients = (enabled = true, params = null) => {
    const { info } = useUser()
    const doctorId = info?.id

    return useQuery(
        ['Patients', doctorId],
        async ({ signal }) => {
            const result = await axios(`/api/doctor/${doctorId}/patients`, { signal })
            return result.data
        },
        {
            initialData: [],
            enabled: !!doctorId && enabled,
            ...params,
        }
    )
}
