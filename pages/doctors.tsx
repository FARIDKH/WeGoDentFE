import { Link, Avatar, Box, Container, Divider, Typography } from '@material-ui/core'
import { useRouter } from 'next/router'
import { useDoctors } from '../hooks/useDoctors'
import Layout from '../layout/main/Layout'

import Loading from '../ui-component/Loading'
import NoResult from '../ui-component/NoResult'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DigitalClock, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import avatar from '../assets/images/avatar.png'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useEffect, useRef, useState } from 'react'
import CreateAppointment from '../modules/main/appointments/CreateAppointment'
import Header2, { HeaderSearchForm } from '../layout/main/Header2'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMobile } from '../ui-component/hooks/useMobile'

dayjs.extend(isBetween)

const initialState = {
    day: null,
    time: null,
    doctorId: null,
}

const DoctorsPage = () => {
    const ref = useRef(null)

    const [selected, setSelected] = useState(initialState)

    const { query } = useRouter()

    const { doctorType, officeLocation } = query ?? {}

    const { data: doctors, isFetching } = useDoctors({
        doctorType,
        officeLocation,
        checkAuth: false,
    })

    const isMobile = useMobile()

    useEffect(() => {
        if (Object.values(selected).every((val) => !!val)) {
            ref?.current?.open(selected)
        }
    }, [selected])

    return (
        <Layout>
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
                    <Box
                        mb={2}
                        sx={{
                            textAlign: {
                                sm: 'left',
                                xs: 'center',
                            },
                        }}
                    >
                        <Typography variant="h2" mb={1}>
                            {(doctorType as string)?.replaceAll('_', ' ')}, {officeLocation}
                        </Typography>
                        <Typography color="#808080">
                            <strong>Book appointment online without any extra fee</strong>
                        </Typography>
                    </Box>

                    {isFetching ? (
                        <Loading size={60} />
                    ) : !doctors?.length ? (
                        <NoResult />
                    ) : (
                        <Box>
                            {doctors?.map((doctor, i) => {
                                const availabilityList = doctor?.doctorAvailabilityDTOList
                                const availableRange = availabilityList?.find((item) =>
                                    dayjs(new Date()).isBetween(item?.startDateTime, item?.endDateTime)
                                )

                                const startDate = dayjs(availableRange ? new Date() : availabilityList?.[0]?.startDateTime ?? new Date())
                                const isFuture = startDate?.isAfter(new Date())

                                const endDateTime = dayjs(availableRange?.endDateTime ?? availabilityList?.[0]?.endDateTime)
                                const availableFutureDays = startDate.add(25, 'days')
                                const endDate = endDateTime && availableFutureDays?.isAfter(endDateTime) ? endDateTime : availableFutureDays

                                const doctorName = `${doctor?.userDTO?.firstName} ${doctor?.userDTO?.lastName}`

                                const isSelectedDoctor = doctor?.id === selected?.doctorId
                                const doctorLink = '/doctors/' + doctor?.id
                                return (
                                    <Box key={doctor?.id}>
                                        <Box
                                            display="flex"
                                            sx={{
                                                flexDirection: {
                                                    sm: 'row',
                                                    xs: 'column',
                                                },
                                            }}
                                        >
                                            <Box
                                                className="doctorInfo"
                                                display="flex"
                                                flex={1}
                                                sx={{
                                                    mt: 3,
                                                    mb: {
                                                        sm: 0,
                                                        xs: 3,
                                                    },
                                                }}
                                            >
                                                <Box>
                                                    <Avatar src={avatar?.src} alt={doctorName} sx={{ width: 75, height: 75 }} />
                                                </Box>
                                                <Box ml="12px">
                                                    <Typography variant="h4">
                                                        <Link key={doctor.id} href={doctorLink}>
                                                            {' '}
                                                            <strong>Dr. {doctorName}</strong>{' '}
                                                        </Link>
                                                    </Typography>
                                                    <Typography my={1}>{doctor?.doctorType?.replaceAll('_', ' ')}</Typography>
                                                    <Typography
                                                        my={1}
                                                        sx={{
                                                            width: '75%',
                                                            textAlign: 'justify',
                                                            // textJustify: 'innerWord'
                                                        }}
                                                    >
                                                        {doctor?.experience}
                                                    </Typography>
                                                    <Typography>Office Location: {doctor?.officeLocationName}</Typography>
                                                </Box>
                                            </Box>
                                            <Box
                                                className="appointment"
                                                display="flex"
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
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Box flex={2}>
                                                        <DateCalendar
                                                            views={['day']}
                                                            disablePast
                                                            minDate={startDate}
                                                            maxDate={endDate}
                                                            value={isSelectedDoctor ? selected.day : null}
                                                            onChange={(value) =>
                                                                setSelected((prev) => ({
                                                                    ...prev,
                                                                    day: value,
                                                                    doctorId: doctor?.id,
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
                                                            // value={isSelectedDoctor ? selected.time : null}
                                                            // minTime={dayjs(startDate.format('YYYY-MM-DDT07:00'))}
                                                            // maxTime={dayjs(endDate.format('YYYY-MM-DDT18:00'))}
                                                            // timeStep={60}
                                                            // skipDisabled
                                                            // disablePast={!isFuture}
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
                                                                    doctorId: doctor?.id,
                                                                }))
                                                            }
                                                        />
                                                    </Box>
                                                </LocalizationProvider>
                                            </Box>
                                        </Box>

                                        {i != doctors?.length - 1 && <Divider />}
                                    </Box>
                                )
                            })}
                        </Box>
                    )}
                </Box>

                <CreateAppointment ref={ref} onClose={() => setSelected(initialState)} />
            </Container>
        </Layout>
    )
}

export default DoctorsPage

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}
