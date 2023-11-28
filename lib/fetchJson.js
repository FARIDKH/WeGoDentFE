// import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import https from 'https'

export const apiUrl = process.env.API_URL || 'https://wegodent-service.onrender.com/api'

export const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
})

export default async function fetchJson(...args) {
    try {
        const response = await instance(...args)
        return response.data
    } catch (error) {
        if (!error.data) {
            error.data = { message: error.message }
        }
        throw error
    }
}
