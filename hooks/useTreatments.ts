import { useQuery } from 'react-query'
import useUser from '../lib/useUser'
import axios from '../utils/axios'

export const useDoctorTreatments = (enabled = true, params = null) => {
    const { info } = useUser()
    const doctorId = info?.id

    // console.log(info?.userDTO?.id)
    // console.log(info)

    return useQuery(
        ['Treatments', doctorId],
        async ({ signal }) => {
            const result = await axios(`/api/doctor/${doctorId}/treatments`, { signal })
            return result.data
        },
        {
            initialData: [],
            enabled: !!doctorId && enabled,
            ...params,
        }
    )
}
