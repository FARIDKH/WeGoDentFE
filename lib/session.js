// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { withIronSession } from 'next-iron-session'

export default function withSession(handler) {
    return withIronSession(handler, {
        // eslint-disable-next-line no-undef
        password: process.env.SECRET_COOKIE_PASSWORD || 'we@@@_go@@@_dental@@@2023_we@@@_go@@@_dental@@@2023',
        cookieName: 'we_go_dental',
        cookieOptions: {
            // the next line allows to use the session in non-https environments like
            // Next.js dev mode (http://localhost:3000)
            // secure: process.env.NODE_ENV === "production",
            secure: true,
        },
    })
}
