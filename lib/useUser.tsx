import { useQuery } from 'react-query'
import apiClient from '../utils/axios'
import axios from 'axios'

// export type TUserRoles = 4 | 1 | 2 | 3
export type TUserRoles = 'ROLE_PATIENT' | 'ROLE_DOCTOR' | 'ROLE_ADMIN' | 'ROLE_BLOGGER' | 'ROLE_MANAGER'

export const fetchCurrentUser = async () => {
    const result = await apiClient(`/api/account`, {
        showErrorResponse: false,
    })
    return result.data
}

export default function useUser(redirect = true) {
    const { data, isLoading, refetch } = useQuery('GetUserDetails', fetchCurrentUser, {
        refetchOnMount: false,
        onError: () => {
            redirect && axios.post('/api/logout').finally(() => (location.href = `/admin/login`))
        },
    })

    const user = data?.user ?? data

    const userRoles: TUserRoles[] = user?.userDTO?.groupRoleResponseDTOS?.map((item) => item?.code)
    const adminRole = user?.groupRoleResponseDTOS?.map((item) => item?.code)
    const managerRole = user?.groupRoleResponseDTOS?.map((item) => item?.code)

    const isAdmin = adminRole?.includes('ROLE_ADMIN')
    const isDoctor = userRoles?.includes('ROLE_DOCTOR')
    const isPatient = userRoles?.includes('ROLE_PATIENT')
    const isBlogger = userRoles?.includes('ROLE_BLOGGER')
    const isManager = managerRole?.includes('ROLE_MANAGER')

    return {
        isLoading,
        isLoggedIn: !!data,
        info: data,
        user,
        userRoles,
        isAdmin,
        isDoctor,
        isPatient,
        isBlogger,
        isManager,
        refetch,
    }
}
