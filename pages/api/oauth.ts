import withSession from '../../lib/session'

export default withSession(async (req, res) => {
    try {
        const { token } = req.body

        const tokens = { accessToken: token, isLoggedIn: true }
        req.session.set('tokens', tokens)
        await req.session.save()

        res.status(200).json({ message: 'Token saved successfully' })
    } catch (error) {
        const { response: fetchResponse } = error
        console.log('error', error)
        // eslint-disable-next-line no-undef
        res.status(fetchResponse?.status || 500).json(error.data)
    }
})