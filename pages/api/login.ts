import fetchJson, { apiUrl } from '../../lib/fetchJson'
import withSession from '../../lib/session'

export default withSession(async (req, res) => {
    try {
        const { accessToken } = await fetchJson({
            url: `${apiUrl}/authenticate`,
            method: 'POST',
            data: req.body,
        })

        const tokens = { accessToken, isLoggedIn: true }
        req.session.set('tokens', tokens)
        await req.session.save()
        res.json({
            result: 'success',
        })
    } catch (error) {
        const { response: fetchResponse } = error
        console.log('error', error)
        // eslint-disable-next-line no-undef
        res.status(fetchResponse?.status || 500).json(error.data)
    }
})
