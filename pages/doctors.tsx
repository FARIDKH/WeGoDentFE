import { Avatar, Box, Container, Divider, IconButton, InputAdornment, makeStyles, Paper, TextField, Typography } from '@material-ui/core'
import { useRouter } from 'next/router'
import { ENUM_DOCTOR_TYPES, useDoctors } from '../hooks/useDoctors'
import Layout from '../layout/main/Layout'
import LoginButton from '../layout/main/LoginButton'
import Logo from '../ui-component/Logo'
import DoctorTypeSelect from '../ui-component/main/DoctorTypeSelect'
import IconSearch from '@material-ui/icons/Search'
import { Formik } from 'formik'
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

dayjs.extend(isBetween)

const useStyle = makeStyles(() => ({
    paper: {
        height: '45px',
        borderRadius: '50px',
    },
    selectDoctorType: {
        height: '100%',
        background: 'transparent',
        marginRight: '10px',
        borderRadius: 0,
        borderRight: '1px solid #D9D9D9',
        '& .MuiSelect-root': {
            padding: '4px',
            paddingRight: '32px',
            paddingLeft: '16px',
            background: 'transparent',
        },
        '& fieldset': {
            border: 0,
        },
    },
    inputOfficeLocation: {
        '& .MuiOutlinedInput-root': {
            background: 'transparent',
            height: '100%',
            paddingTop: '0',
            '& input.MuiOutlinedInput-input': {
                background: 'transparent',
                paddingTop: '12px',
                paddingBottom: '12px',
            },

            '& fieldset': {
                border: 0,
            },
        },
    },
}))

const initialState = {
    day: null,
    time: null,
    doctorId: null,
}

const DoctorsPage = () => {
    const ref = useRef(null)

    const [selected, setSelected] = useState(initialState)

    const classes = useStyle()
    const { query, push } = useRouter()

    const { doctorType, officeLocation } = query ?? {}

    const { data: doctors, isFetching } = useDoctors({
        doctorType,
        officeLocation,
        checkAuth: false,
    })

    useEffect(() => {
        if (Object.values(selected).every((val) => !!val)) {
            ref?.current?.open(selected)
        }
    }, [selected])

    return (
        <Layout>
            <Box className="mainBlueBg" paddingY={2}>
                <Container maxWidth="lg">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Logo
                            style={{
                                color: 'white',
                            }}
                        />

                        <Formik
                            enableReinitialize
                            initialValues={{
                                doctorType: (query?.doctorType ?? ENUM_DOCTOR_TYPES.Emergency_Dentist) as string,
                                officeLocation: query?.officeLocation as string,
                            }}
                            onSubmit={(values) => {
                                if (values?.doctorType && values?.officeLocation)
                                    push({
                                        pathname: '/doctors',
                                        query: values,
                                    })
                            }}
                        >
                            {({ handleSubmit, values, handleChange }) => (
                                <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                    <Paper className={classes.paper}>
                                        <DoctorTypeSelect
                                            className={classes.selectDoctorType}
                                            name="doctorType"
                                            value={values?.doctorType}
                                            variant="outlined"
                                            IconComponent={() => null}
                                            handleChange={handleChange}
                                        />

                                        <TextField
                                            className={classes.inputOfficeLocation}
                                            name="officeLocation"
                                            value={values?.officeLocation}
                                            onChange={handleChange}
                                            placeholder="Budapest I. Kerulet"
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => handleSubmit()}
                                                            sx={{
                                                                padding: 0,
                                                            }}
                                                        >
                                                            <IconSearch />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Paper>
                                </form>
                            )}
                        </Formik>

                        <LoginButton
                            variant="outlined"
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    borderColor: 'white',
                                },
                            }}
                        />
                    </Box>
                </Container>
            </Box>
            <Container maxWidth="lg">
                <Box minHeight="50vh" my={4}>
                    <Box mb={2}>
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
                                const availableFutureDays = startDate.add(2, 'days')
                                const endDate = endDateTime && availableFutureDays?.isAfter(endDateTime) ? endDateTime : availableFutureDays

                                const doctorName = `${doctor?.userDTO?.firstName} ${doctor?.userDTO?.lastName}`

                                const isSelectedDoctor = doctor?.id === selected?.doctorId

                                return (
                                    <Box key={doctor?.id}>
                                        <Box display="flex">
                                            <Box className="doctorInfo" display="flex" flex={1} mt={3}>
                                                <Box>
                                                    <Avatar src={avatar?.src} alt={doctorName} sx={{ width: 75, height: 75 }} />
                                                </Box>
                                                <Box ml="12px">
                                                    <Typography variant="h4">
                                                        <strong>Dr. {doctorName}</strong>
                                                    </Typography>
                                                    <Typography my={1}>{doctor?.doctorType?.replaceAll('_', ' ')}</Typography>
                                                    <Typography my={1}>{doctor?.experience}</Typography>
                                                    <Typography>Office Location: {doctor?.officeLocationName}</Typography>
                                                </Box>
                                            </Box>
                                            <Box
                                                className="appointment"
                                                display="flex"
                                                flex={1}
                                                sx={{
                                                    borderLeft: '1px solid #eeeeee',
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
                                                        />
                                                    </Box>
                                                    <Box flex={1}>
                                                        <DigitalClock
                                                            value={isSelectedDoctor ? selected.time : null}
                                                            minTime={startDate}
                                                            maxTime={dayjs(endDate.format('YYYY-MM-DDT18:00'))}
                                                            timeStep={60}
                                                            skipDisabled
                                                            disablePast={!isFuture}
                                                            sx={{
                                                                maxHeight: '300px',
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
