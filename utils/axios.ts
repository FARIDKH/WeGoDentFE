/* eslint-disable no-undef */
import axios from 'axios'
import { store } from '../pages/_app'
import { SNACKBAR_OPEN } from '../store/actions'

declare module 'axios' {
    export interface AxiosRequestConfig {
        showErrorResponse?: boolean
        checkAuth?: boolean
    }
}

const apiClient = axios.create({
    showErrorResponse: true,
    checkAuth: true,
})

apiClient.interceptors.request.use(
    function (config) {
        if (process.env.NEXT_PUBLIC_BASE_PATH && config.url.startsWith('/api')) {
            config.url = `${process.env.NEXT_PUBLIC_BASE_PATH}${config.url}`
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

apiClient.interceptors.request.use(
    function (config) {
        config.headers = {
            'check-auth': config?.checkAuth,
        }

        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

axios.interceptors.request.use(
    function (config) {
        if (process.env.NEXT_PUBLIC_BASE_PATH && config.url.startsWith('/api')) {
            config.url = `${process.env.NEXT_PUBLIC_BASE_PATH}${config.url}`
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    async function (response) {
        return response
    },
    async function (error) {
        const originalRequest = error.config
        if (originalRequest?.showErrorResponse)
            store.dispatch({
                type: SNACKBAR_OPEN,
                open: true,
                message: 'Error occured',
                variant: 'alert',
                alertSeverity: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
            })
        return Promise.reject(error)
    }
)

export default apiClient
