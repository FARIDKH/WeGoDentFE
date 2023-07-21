import fetchJson, { apiUrl } from '../../lib/fetchJson'
import withSession from '../../lib/session'

export default withSession(async (req, res) => {
    const user = req.session.get('tokens')
    req.session.destroy()

    try {
        await fetchJson({
            method: 'POST',
            url: `${apiUrl}/logout`,
            headers: {
                Authorization: `Bearer ${user?.accessToken}`,
            },
        })

        res.json({ isLoggedIn: false })
    } catch (error) {
        // eslint-disable-next-line no-undef
        const { response: fetchResponse } = error
        res.status(fetchResponse?.status || 500).json(fetchResponse.data || error.data)
    }
})
