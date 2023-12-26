import { Link, Box, Container, Divider, Typography, Rating, Tooltip, Pagination, Button, makeStyles } from '@material-ui/core'

import LocationOnIcon from '@mui/icons-material/LocationOn'
import VerifiedIcon from '@mui/icons-material/Verified'
import { useRouter } from 'next/router'
import { useClinicsByLocationAndDoctorType } from '../hooks/useClinicsByLocationAndDoctorType'
import Layout from '../layout/main/Layout'

import Loading from '../ui-component/Loading'
import NoResult from '../ui-component/NoResult'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DigitalClock, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useEffect, useRef, useState } from 'react'
import CreateClinicAppointment from '../modules/appointments/CreateClinicAppointment'
import Header2, { HeaderSearchForm } from '../layout/main/Header2'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMobile } from '../ui-component/hooks/useMobile'
import GoogleMap from '../ui-component/GoogleMap'
import useUser from '../lib/useUser'
import ClinicPicture from '../modules/clinics/ClinicPicture'
import { useTranslation } from 'next-i18next'
import DOMPurify from 'dompurify'

dayjs.extend(isBetween)

const initialState = {
    day: null,
    time: null,
    clinicId: null,
    clinicIsSubscribed: false,
}

const useStyles = makeStyles((theme) => ({
    showNumberButton: {
        marginTop: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        textTransform: 'none',
        fontSize: '0.8rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderRadius: '4px',
    },
}))

const ClinicsPage = () => {
    const ref = useRef(null)
    const { isLoggedIn, refetch } = useUser(false)
    const [page, setPage] = useState(1)
    const { t, i18n } = useTranslation('common')
    const curLang = i18n.language
    const ITEMS_PER_PAGE = 4

    const [selected, setSelected] = useState(initialState)

    const { query } = useRouter()

    const { doctorType, officeLocation } = query ?? {}

    const { data: clinics, isFetching } = useClinicsByLocationAndDoctorType({
        doctorType,
        officeLocation,
        checkAuth: false,
    })

    const handlePageChange = (event, value) => {
        setPage(value)
    }

    let translatedDoctorType = doctorType
    var metaDescription = 'Wegodent makes it easy to browse dental clinics near you. Take care of your healthy smile today!'
    var metaTitle = 'The best dental clinics near you - Wegodent'
    if (curLang === 'hu') {
        translatedDoctorType = t(`DoctorType.${doctorType}`)
        metaDescription =
            'Wegodent könnyedén böngészhet a közelben található fogászati klinikák között. Gondoskodjon egészséges mosolyáról ma!'
        metaTitle = 'A legjobb fogászati klinikák a közelben - Wegodent'
    }

    const officeLocations = clinics?.map((clinic) => clinic.officeLocationName) ?? []

    const isMobile = useMobile()

    const [value, setValue] = useState<number | null>(5)

    useEffect(() => {
        if (Object.values(selected).every((val) => !!val)) {
            ref?.current?.open(selected)
        }
    }, [selected])

    const classes = useStyles()

    const phoneStyles = {
        filter: !isLoggedIn ? 'blur(4px)' : 'none',
        cursor: !isLoggedIn ? 'pointer' : 'default',
    }

    const blurPhoneNumber = (phoneNumber) => {
        if (!phoneNumber) {
            return null
        }
        const visibleDigits = phoneNumber.slice(-4) // Show the last 4 digits
        const hiddenDigits = phoneNumber.slice(0, -4).replace(/[0-9]/g, '*') // Replace the first digits with '*'
        return `${hiddenDigits}${visibleDigits}`
    }

    const getDescriptionSnippet = (description: string, href: string) => {
        const maxLength = 255
        let sanitizedDescription = DOMPurify.sanitize(description)

        if (sanitizedDescription.length <= maxLength) {
            return <span dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
        }

        // Truncate description and ensure it doesn't cut off in the middle of a word
        const truncated = sanitizedDescription.substring(0, sanitizedDescription.lastIndexOf(' ', maxLength)) + '... '

        return (
            <>
                <Typography variant="body1" component="span" dangerouslySetInnerHTML={{ __html: truncated }} />
                <Link rel="alternate" hrefLang={curLang} href={href} color="primary">
                    {t('labelMoreInfo')}
                </Link>
            </>
        )
    }

    // First, add an index to each item using reduce
    const clinicsWithIndex = clinics.reduce((acc, clinic, index) => {
        acc.push({ ...clinic, index })
        return acc
    }, [])

    // Sort the clinics array, prioritizing the enabled clinics
    const sortedClinics = clinicsWithIndex.sort((a, b) => {
        if (a.isEnabled && !b.isEnabled) return -1 // a comes first
        if (!a.isEnabled && b.isEnabled) return 1 // b comes first
        return a.index - b.index // otherwise keep the original order
    })

    const displayedClinics = sortedClinics.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

    return (
        <Layout description={metaDescription} title={metaTitle}>
            <Header2 />

            <Container maxWidth="lg">
                {isMobile && (
                    <Box mt={3}>
                        <HeaderSearchForm />
                        <Divider
                            sx={{
                                marginY: 3,
                            }}
                        />
                    </Box>
                )}

                <Box minHeight="50vh" my={4}>
                    {isFetching ? (
                        <Loading size={60} />
                    ) : !clinics?.length ? (
                        <NoResult />
                    ) : (
                        <>
                            <Box>
                                <GoogleMap pinpointAddresses={officeLocations} clinics={clinics} address={officeLocation} />
                            </Box>
                            <Box
                                my={5}
                                sx={{
                                    textAlign: {
                                        sm: 'left',
                                        xs: 'center',
                                    },
                                }}
                            >
                                <Typography variant="h2" mb={1}>
                                    {(translatedDoctorType as string)?.replaceAll('_', ' ')}, {officeLocation}
                                </Typography>
                                <Typography color="#808080">
                                    <strong>{t('labelResultSubtitle')}</strong>
                                </Typography>
                            </Box>

                            <Box>
                                <Box>
                                    <Pagination
                                        count={Math.ceil(clinics.length / ITEMS_PER_PAGE)}
                                        page={page}
                                        onChange={handlePageChange}
                                    />

                                    {displayedClinics?.map((clinic, i) => {
                                        const startDate = dayjs(new Date())
                                        const isFuture = startDate?.isAfter(new Date())
                                        // const endDate = endDateTime && availableFutureDays?.isAfter(endDateTime) ? endDateTime : availableFutureDays

                                        // const doctorName = `${doctor?.userDTO?.firstName} ${doctor?.userDTO?.lastName}`
                                        const clinicName = clinic?.name
                                        const clinicId = clinic?.clinicId
                                        const isSelectedDoctor = clinic?.clinicId === selected?.clinicId
                                        const modifiedName = clinicName.toLowerCase().replace(/\s+/g, '-')
                                        const clinicLink = curLang === 'en' ? '/en/clinics/' + modifiedName : '/klinikak/' + modifiedName
                                        return (
                                            <Box key={clinicId}>
                                                <Box
                                                    display="flex"
                                                    sx={{
                                                        flexDirection: {
                                                            sm: 'row',
                                                            xs: 'column',
                                                        },
                                                    }}
                                                >
                                                    <Box padding="25px" paddingLeft="0" flex={1}>
                                                        <Box
                                                            className="doctorInfo"
                                                            display="flex"
                                                            sx={{
                                                                mt: 3,
                                                                mb: {
                                                                    sm: 0,
                                                                    xs: 3,
                                                                },
                                                            }}
                                                        >
                                                            <Box>
                                                                <ClinicPicture
                                                                    clinic={clinic}
                                                                    style={{
                                                                        borderRadius: '50%',
                                                                        objectFit: 'cover',
                                                                        width: 75,
                                                                        height: 75,
                                                                    }}
                                                                />
                                                            </Box>
                                                            <Box ml="12px">
                                                                <Typography variant="h4">
                                                                    <Link
                                                                        rel="alternate"
                                                                        hrefLang={curLang}
                                                                        underline="none"
                                                                        key={clinicId}
                                                                        href={clinicLink}
                                                                    >
                                                                        <Box display="flex" alignItems="center">
                                                                            <strong style={{ marginRight: '10px', color: 'black' }}>
                                                                                {clinicName}
                                                                            </strong>
                                                                            {clinic?.isEnabled && (
                                                                                <Tooltip title="This clinic has been verified by Wegodent">
                                                                                    <VerifiedIcon sx={{ color: '#329DFF' }} />
                                                                                </Tooltip>
                                                                            )}
                                                                        </Box>
                                                                    </Link>
                                                                </Typography>
                                                                <div>
                                                                    {clinic?.doctorTypes?.map((type, index) => (
                                                                        <Typography
                                                                            key={index}
                                                                            mt={2}
                                                                            sx={{
                                                                                display: 'inline-block',
                                                                                color: 'lightgray',
                                                                                cursor: 'pointer',
                                                                                marginRight: '5px',
                                                                                transition: 'color 0.3s',
                                                                                '&:hover': {
                                                                                    color: 'black',
                                                                                },
                                                                            }}
                                                                        >
                                                                            {type}
                                                                        </Typography>
                                                                    ))}
                                                                </div>
                                                                <Box sx={{ marginTop: 2 }} gap={2} display="flex" alignItems="center">
                                                                    <Rating name="read-only" value={value} readOnly />
                                                                    <Typography>0 {t('labelAppointment')} </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>

                                                        <Box mt={3} mb={3} gap={1} display="flex" alignItems="center">
                                                            <LocationOnIcon sx={{ color: '#329DFF' }}></LocationOnIcon>
                                                            <Typography> {clinic?.officeLocationName} </Typography>
                                                        </Box>

                                                        <Box>
                                                            <Typography>
                                                                {getDescriptionSnippet(clinic?.description || '', clinicLink)}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        className="appointment"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        flex={1}
                                                        sx={{
                                                            borderLeft: {
                                                                sm: '1px solid #eeeeee',
                                                                xs: '0',
                                                            },
                                                            borderTop: {
                                                                sm: '0',
                                                                xs: '1px solid #eeeeee',
                                                            },
                                                        }}
                                                    >
                                                        {clinic?.isEnabled ? (
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <Box flex={2}>
                                                                    <DateCalendar
                                                                        views={['day']}
                                                                        disablePast
                                                                        minDate={startDate}
                                                                        value={isSelectedDoctor ? selected.day : null}
                                                                        onChange={(value) =>
                                                                            setSelected((prev) => ({
                                                                                ...prev,
                                                                                day: value,
                                                                                clinicId: clinicId,
                                                                                clinicIsSubscribed: true,
                                                                            }))
                                                                        }
                                                                        sx={{
                                                                            width: {
                                                                                sm: 320,
                                                                                xs: 290,
                                                                            },
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Box flex={1}>
                                                                    <DigitalClock
                                                                        sx={{
                                                                            maxHeight: '300px',
                                                                            '& .MuiDigitalClock-item': {
                                                                                padding: {
                                                                                    sm: '8px 16px',
                                                                                    xs: 0,
                                                                                },
                                                                                fontSize: {
                                                                                    sm: 'inherit',
                                                                                    xs: '0.75rem',
                                                                                },
                                                                            },
                                                                        }}
                                                                        onChange={(value) =>
                                                                            setSelected((prev) => ({
                                                                                ...prev,
                                                                                time: value,
                                                                                clinicId: clinicId,
                                                                                clinicIsSubscribed: true,
                                                                            }))
                                                                        }
                                                                    />
                                                                </Box>
                                                            </LocalizationProvider>
                                                        ) : (
                                                            <Box>
                                                                <Typography variant="h1">
                                                                    {!isLoggedIn ? (
                                                                        <div>
                                                                            <Typography style={phoneStyles} variant="h1">
                                                                                {blurPhoneNumber(clinic?.phoneNumber)}
                                                                            </Typography>
                                                                            <Box display="flex" justifyContent="center" mt={1}>
                                                                                <Button
                                                                                    size="small"
                                                                                    className={classes.showNumberButton}
                                                                                    onClick={() => {
                                                                                        ref?.current?.open({
                                                                                            clinicIsSubscribed: false,
                                                                                        })
                                                                                    }}
                                                                                >
                                                                                    {t('labelShowNumber')}
                                                                                </Button>
                                                                            </Box>
                                                                        </div>
                                                                    ) : (
                                                                        <Typography variant="h1">{clinic?.phoneNumber}</Typography>
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>

                                                {i != clinics?.length - 1 && <Divider />}
                                            </Box>
                                        )
                                    })}

                                    {/* <Pagination count={Math.ceil(clinics.length / ITEMS_PER_PAGE)} page={page} onChange={handlePageChange} /> */}
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>

                <CreateClinicAppointment ref={ref} onClose={() => setSelected(initialState)} onSuccess={refetch} />
            </Container>
        </Layout>
    )
}

export default ClinicsPage

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}
