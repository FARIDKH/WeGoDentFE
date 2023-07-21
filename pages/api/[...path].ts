import withSession from '../../lib/session'
import fetchJson, { apiUrl } from '../../lib/fetchJson'

const excludeApis = [`/api/login`, '/api/logout']

export default withSession(async (req, res) => {
    const user = req.session.get('tokens')
    const checkAuth = req?.headers?.['check-auth'] === 'true'

    if (checkAuth && !excludeApis.includes(req.url) && !user?.isLoggedIn) {
        res.status(401).end()
        return
    }

    const url = req.url.replace('/api', apiUrl)

    try {
        const data = await fetchJson({
            method: req.method,
            url,
            headers: checkAuth
                ? {
                      Authorization: `Bearer ${user?.accessToken}`,
                  }
                : {},
            data: req.body || {},
        })

        res.json(data)
    } catch (error) {
        // eslint-disable-next-line no-undef
        // console.log(error)
        const { response: fetchResponse } = error
        res.status(fetchResponse?.status || 500).json(fetchResponse.data || error.data)
    }
})
