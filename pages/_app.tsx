import type { AppProps } from 'next/app'
import { createStore } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import reducer from '../store/reducer'
import { FILTER_STATE } from '../store/actions'
import '../assets/scss/style.scss'
import Head from 'next/head'

import SnackBar from '../ui-component/extended/Snackbar'
import { QueryClient, QueryClientProvider } from 'react-query'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { LinearProgress } from '@material-ui/core'
import BaseLayout from '../layout/admin/BaseLayout'


import { appWithTranslation } from 'next-i18next'

export const store = createStore(reducer)

const Loading = ({ initial }: { initial: boolean }) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const filterState: any = useSelector((state: any) => state.filter)

    React.useEffect(() => {
        const handleComplete = () => {
            try {
                const action = {
                    type: FILTER_STATE,
                    payload: {
                        resources: {
                            ...filterState?.resources,
                            [router.pathname]: router.asPath,
                        },
                        prev: filterState?.curr || null,
                        curr: {
                            ...router,
                            referer: router.pathname.replace('/', ''), //router.pathname.split('/')[1]
                        },
                    },
                }

                dispatch(action)
            } catch (e) {
                console.log(e)
            }
        }

        router.events.on('routeChangeComplete', handleComplete)

        return () => {
            router.events.off('routeChangeComplete', handleComplete)
        }
    })

    return (
        <div
            style={{ background: initial ? '#fff' : 'transparent', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
        >
            <LinearProgress color="primary" className="linear-loading" />
        </div>
    )
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
})

function App({ Component, pageProps }: AppProps) {
    const router = useRouter()

    const [loading, setLoading] = React.useState(true)
    const [initial, setInitial] = React.useState(true)

    React.useEffect(() => {
        const handleStart = (url) => url !== router.asPath && setLoading(true)
        const handleComplete = () => setLoading(false)

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    })

    useEffect(() => {
        if (initial && loading) {
            setInitial(false)
            setLoading(false)
        }
    })

    useEffect(() => {
        const action = {
            type: FILTER_STATE,
            payload: {
                curr: {
                    ...router,
                    referer: router.pathname.replace('/', ''),
                },
            },
        }

        store.dispatch(action)
    }, [])

    return (
        <>
            <Head>
                <title>WeGoDent.</title>
            </Head>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BaseLayout>
                        {loading && <Loading initial={initial} />}
                        <Component {...pageProps} />
                        <SnackBar />
                    </BaseLayout>
                </QueryClientProvider>
            </Provider>
        </>
    )
}
export default appWithTranslation(App)
