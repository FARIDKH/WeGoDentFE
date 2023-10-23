import https from 'https'
import httpProxyMiddleware from 'next-http-proxy-middleware'
import withSession from '../../../../lib/session'
import { apiUrl } from '../../../../lib/fetchJson'

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false,
    },
}

export default withSession(async (req, res) => {
    const user = req.session.get('tokens')

    if (!user?.isLoggedIn) {
        res.status(401).end()
        return
    }

    const id = req?.query?.id

    try {
        return httpProxyMiddleware(req, res, {
            target: apiUrl,
            pathRewrite: [
                {
                    patternStr: `^/api/doctor/${id}/upload`,
                    replaceStr: `/doctor/${id}/profile-picture`,
                },
            ],
            headers: {
                'Content-type': req.headers['content-type'],
                'Content-length': req.headers['content-length'],
                Authorization: `Bearer ${user?.accessToken}`,
            },
            agent: new https.Agent({
                rejectUnauthorized: false,
            }),
        })
    } catch (error) {
        // eslint-disable-next-line no-undef
        console.log(error)
        const { response: fetchResponse } = error
        res.status(fetchResponse?.status || 500).json(fetchResponse.data || error.data)
    }
})
