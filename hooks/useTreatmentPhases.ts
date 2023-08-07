import { useQuery } from 'react-query'
import useUser from '../lib/useUser'
import axios from '../utils/axios'

export const useTreatmentPhases = (treatmentId, enabled = true, params = null) => {
    const { info } = useUser()
    const doctorId = info?.id
    // const treatmentId = 1
    // console.log(info?.userDTO?.id)
    // console.log(info)

    return useQuery(
        ['TreatmentPhases', treatmentId],
        async ({ signal }) => {
            const result = await axios(`/api/treatment/${treatmentId}/phases`, { signal })
            return result.data
        },
        {
            initialData: [],
            enabled: !!treatmentId && enabled,
            ...params,
        }
    )
}
