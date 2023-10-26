import { Box, Container, Typography, Grid, Button } from '@material-ui/core'
import { useRouter } from 'next/router'
import * as React from 'react'

import PhoneIphoneIcon from '@mui/icons-material/LocalPhoneOutlined'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocationOnOutlined from '@mui/icons-material/LocationOnOutlined'
import GoogleMap from '../../ui-component/GoogleMap'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { useClinicByName } from '../../hooks/useClinicByName'

import useUser from '../../lib/useUser'
import Layout from '../../layout/main/Layout'
import Loading from '../../ui-component/Loading'
import NoResult from '../../ui-component/NoResult'

import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DigitalClock, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useEffect, useRef, useState } from 'react'
import CreateAppointment from '../../modules/main/appointments/CreateAppointment'
import Header2 from '../../layout/main/Header2'
import { Star } from '@material-ui/icons'
import Reviews from '../../modules/clinics/Reviews'
import ClinicPicture from '../../modules/clinics/ClinicPicture'
import { apiUrl } from '../../lib/fetchJson'
import { GetStaticPaths } from 'next'

dayjs.extend(isBetween)

const initialState = {
    day: null,
    time: null,
    clinicId: null,
    clinicIsSubscribed: false,
}

const SingleClinic = () => {
    const ref = useRef(null)

    const { isLoggedIn } = useUser(false)

    const [selected, setSelected] = useState(initialState)

    const { query } = useRouter()

    const { name } = query ?? {}

    const [value, setValue] = useState<number | null>(5)

    const { data: clinic, isFetching } = useClinicByName({
        name,
        checkAuth: false,
    })

    useEffect(() => {
        console.log('selected', selected)
        if (Object.values(selected).every((val) => !!val)) {
            ref?.current?.open(selected)
        }
    }, [selected])

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

    const startDate = dayjs(new Date())

    const doctors = clinic?.doctorList?.slice(0, 4)

    return (
        <Layout title={clinic?.name}>
            <Header2 showForm={false} />

            <Box minHeight="50vh" my={4}>
                {isFetching ? (
                    <Loading size={60} />
                ) : !clinic ? (
                    <NoResult />
                ) : (
                    <>
                        <Container maxWidth="lg">
                            <Box key={clinic?.id}>
                                <Box
                                    display="flex"
                                    sx={{
                                        flexDirection: {
                                            md: 'row',
                                            xs: 'column',
                                        },
                                    }}
                                >
                                    <Box
                                        className="doctorInfo"
                                        display="flex"
                                        flexWrap="wrap"
                                        alignItems="center"
                                        flex={1}
                                        justifyContent="space-between"
                                        gap="60px"
                                        sx={{
                                            mt: 3,
                                            mb: {
                                                sm: 0,
                                                xs: 3,
                                            },
                                        }}
                                        mb={10}
                                    >
                                        <Box flex={1}>
                                            <Typography variant="h1" fontSize="36px">
                                                <strong>{clinic?.name}</strong>
                                            </Typography>

                                            <Box mt={1} display="flex" alignItems="center" gap={2}>
                                                <Typography>{clinic?.officeLocationName}</Typography>
                                                <Box display="flex" alignItems="center">
                                                    <Star
                                                        sx={{
                                                            fill: '#FFE817',
                                                            width: '20px',
                                                            height: '20px',
                                                        }}
                                                    />
                                                    <Typography mt="2px">{value}</Typography>
                                                </Box>
                                            </Box>

                                            <Typography mt="40px" lineHeight="24px">
                                                {clinic?.description}
                                            </Typography>
                                        </Box>
                                        <Box
                                            width="350px"
                                            height="350px"
                                            borderRadius="50%"
                                            sx={{
                                                p: 2,
                                                border: '1px solid #329DFF',
                                            }}
                                        >
                                            <ClinicPicture clinic={clinic} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            {!!doctors?.length && (
                                <>
                                    <Box mt="100px" sx={{ textAlign: 'center' }}>
                                        <Typography sx={{ color: '#00624F' }} variant="h1">
                                            Meet the team
                                        </Typography>
                                        <Typography mt={3} mb={3} variant="h5">
                                            Whether you need a professional teeth cleaning, are interested in an implant or simply want a
                                            check-up appointment - we are here for you.
                                        </Typography>
                                        <Grid
                                            direction="row"
                                            justifyContent="center"
                                            alignItems="center"
                                            mt={5}
                                            mb={5}
                                            container
                                            spacing={5}
                                        >
                                            {doctors?.map((doctor) => {
                                                const doctorImgUrl = `${apiUrl}/doctor/${doctor?.id}/profile-picture`

                                                return (
                                                    <Grid key={doctor?.id} item xs={3}>
                                                        <Box
                                                            width="100%"
                                                            height="400px"
                                                            sx={{
                                                                borderRadius: '8px',
                                                                position: 'relative',
                                                                border: '1px solid #D3D3D3',
                                                            }}
                                                        >
                                                            <Box
                                                                height="100%"
                                                                width="100%"
                                                                sx={{
                                                                    borderRadius: '8px',
                                                                    background: `url(${doctorImgUrl}) no-repeat center/cover`, // replace with your image path
                                                                }}
                                                            />

                                                            <Box
                                                                width="100%"
                                                                minHeight="100px"
                                                                position="absolute"
                                                                bottom="0"
                                                                bgcolor="white"
                                                                sx={{
                                                                    padding: '10px',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    borderRadius: '8px',
                                                                    borderTopLeftRadius: 0,
                                                                    borderTopRightRadius: 0,
                                                                }}
                                                            >
                                                                <Typography variant="h2" color="black">
                                                                    Dr. {doctor?.userDTO?.lastName}
                                                                </Typography>
                                                                <Typography variant="h4" color="black">
                                                                    {doctor?.doctorType?.replace('_', ' ')}
                                                                </Typography>
                                                                <Button
                                                                    color="primary"
                                                                    variant="contained"
                                                                    sx={{
                                                                        padding: '8px 24px',
                                                                        borderRadius: '8px',
                                                                        color: 'white',
                                                                        marginTop: '8px',
                                                                    }}
                                                                >
                                                                    Appointment
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </Box>
                                </>
                            )}

                            <Box mt="150px" textAlign="center">
                                <Typography variant="h3" sx={{ color: '#00624F', fontSize: '30px' }}>
                                    HOW TO FIND OUR DENTAL PRACTICE
                                </Typography>
                                <Typography mt={3} mb={3} variant="h5">
                                    Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up
                                    appointment - we are here for you.
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '45px', paddingX: '150px' }}>
                                <Box
                                    sx={{
                                        padding: '40px',
                                        borderRadius: '12px',
                                        background: '#E7FDF0',
                                        flex: 1,
                                        height: 'fit-content',
                                        maxWidth: '350px',
                                    }}
                                >
                                    <div
                                        style={{
                                            marginBottom: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        <LocationOnOutlined sx={{ color: '#00624F', fontSize: 32 }} />
                                        <Typography variant="h5">{clinic?.officeLocationName}</Typography>
                                    </div>
                                    <div
                                        style={{
                                            marginBottom: '15px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        <PhoneIphoneIcon sx={{ color: '#00624F', fontSize: 32 }} />
                                        <Typography variant="h5">{clinic?.phoneNumber}</Typography>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                                        <CalendarMonthIcon sx={{ color: '#00624F', fontSize: 32 }} />
                                        <Typography variant="h5">Mon - Sun: 8:00-20:00</Typography>
                                    </div>
                                </Box>

                                <Box style={{ height: '360px', background: '#ccc', flex: 1, borderRadius: '8px' }}>
                                    <GoogleMap clinics={[]} address={clinic?.officeLocationName} />
                                </Box>
                            </Box>

                            <Box mt="150px" sx={{ textAlign: 'center', paddingX: '150px' }}>
                                <Typography variant="h3" sx={{ color: '#00624F', fontSize: '30px' }}>
                                    Our calendar
                                </Typography>
                                <Typography mb={5} mt={3} variant="h5">
                                    Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up
                                    appointment - we are here for you.
                                </Typography>

                                <Box display="flex" alignItems="center" justifyContent="center">
                                    <Box
                                        className="appointment"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{
                                            background: '#E7FDF0',
                                            borderRadius: '8px',
                                            p: 4,
                                        }}
                                    >
                                        {clinic?.isEnabled ? (
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Box flex={2}>
                                                    <DateCalendar
                                                        views={['day']}
                                                        disablePast
                                                        minDate={startDate}
                                                        // value={isSelectedDoctor ? selected.day : null}
                                                        onChange={(value) =>
                                                            setSelected((prev) => ({
                                                                ...prev,
                                                                day: value,
                                                                clinicId: clinic?.clinicId,
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
                                                                clinicId: clinic?.clinicId,
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
                                                        <Typography
                                                            onClick={() => {
                                                                ref?.current?.open({
                                                                    clinicIsSubscribed: false,
                                                                })
                                                            }}
                                                            style={phoneStyles}
                                                            variant="h1"
                                                        >
                                                            {blurPhoneNumber(clinic?.phoneNumber)}
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="h1">{clinic?.phoneNumber}</Typography>
                                                    )}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            <Reviews />
                        </Container>
                    </>
                )}
            </Box>

            <CreateAppointment ref={ref} onClose={() => setSelected(initialState)} />
        </Layout>
    )
}

export default SingleClinic

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}