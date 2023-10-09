import { Avatar, Box, Container, Divider, Typography, Rating, Grid, Link, Button, Tooltip } from '@material-ui/core'
import { useRouter } from 'next/router'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import VerifiedIcon from '@mui/icons-material/Verified'
// import Rating from '@mui/material/Rating';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
import * as React from 'react'
import axios from '../../utils/axios'

import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ShareLocationIcon from '@mui/icons-material/ShareLocation'
import GoogleMap from '../../ui-component/GoogleMap'

import { useClinic } from '../../hooks/useClinic'

import useUser from '../../lib/useUser'
import Layout from '../../layout/main/Layout'
import Loading from '../../ui-component/Loading'
import NoResult from '../../ui-component/NoResult'

import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DigitalClock, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import avatar from '../../assets/images/avatar.png'
import avatarClinic from '../../assets/images/avatar-clinic.png'
import dentistProflePic from '../../assets/images/dentist-profile-pic.png'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useEffect, useRef, useState } from 'react'
import CreateAppointment from '../../modules/main/appointments/CreateAppointment'
import Header2 from '../../layout/main/Header2'

dayjs.extend(isBetween)

const initialState = {
    day: null,
    time: null,
    doctorId: null,
}

const SingleClinic = () => {
    const ref = useRef(null)

    const { isLoggedIn, refetch } = useUser(false)

    const [selected, setSelected] = useState(initialState)

    const { query } = useRouter()

    const { id } = query ?? {}

    const [value, setValue] = useState<number | null>(4)
    const [clinicPicture, setClinicPicture] = useState(null)

    const { data: clinic, isFetching } = useClinic({
        id,
        checkAuth: false,
    })

    const fetchClinicPicture = async () => {
        try {
            const response = await axios.get(`/api/clinics/${clinic?.clinicId}/picture`, {
                showErrorResponse: false, // Disable error handling for this request
            }) // If the request is successful, set the clinic picture
            setClinicPicture(response.data)
        } catch (error) {
            // If there's an error, you can handle it here (e.g., log it)
            console.error('Error fetching clinic picture:', error)
        }
    }

    useEffect(() => {
        fetchClinicPicture()
    }, [clinic?.clinicId])

    // const isSelectedDoctor = clinic?.clinicId === selected?.clinicId

    useEffect(() => {
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

    return (
        <Layout title={clinic?.name}>
            <Header2 showForm={false} />

            <Box minHeight="50vh" my={4}>
                {isFetching && id != undefined ? (
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
                                        sx={{
                                            mt: 3,
                                            mb: {
                                                sm: 0,
                                                xs: 3,
                                            },
                                        }}
                                        mb={10}
                                    >
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Box ml="12px">
                                                    <Typography variant="h1">
                                                        <strong>{clinic?.name}</strong>
                                                    </Typography>

                                                    <Typography mt={2} mb={2} sx={{ width: '75%', textAlign: 'justify' }} my={1}>
                                                        {clinic?.officeLocationName}
                                                    </Typography>
                                                    <Rating name="read-only" value={value} readOnly />
                                                    <Typography
                                                        style={{
                                                            fontSize: '16px',
                                                            lineHeight: '1.5',
                                                            color: '#333',
                                                            margin: '0 0 16px',
                                                        }}
                                                    >
                                                        At <span style={{ fontWeight: 'bold' }}> {clinic?.name} </span>, we prioritize your
                                                        dental health and smile. Nestled in the heart of{' '}
                                                        <span style={{ fontStyle: 'italic' }}> {clinic?.officeLocationName} </span>, our
                                                        state-of-the-art dental facility offers a serene and welcoming environment, equipped
                                                        with the latest in dental technology. Our team of dedicated professionals is
                                                        committed to providing personalized care, ensuring that each patient experiences
                                                        optimal oral health and a radiant smile. Whether you're in for a routine check-up, a
                                                        cosmetic procedure, or more intensive treatment, we strive to exceed your
                                                        expectations, making every visit a comfortable and rewarding experience.
                                                    </Typography>
                                                    {/* <Divider /> */}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} 
                                                style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center'
                                                }}>
                                                <div 
                                                    style={{
                                                        borderRadius: '25px',
                                                        width: '450px',  // Specify the fixed width
                                                        height: '300px', // Specify the fixed height
                                                        backgroundImage: 'url(https://source.unsplash.com/random?clinic)',
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                    aria-label="Random dentist clinic from Unsplash" // accessibility attribute as alt alternative
                                                ></div>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Box>
                        </Container>

                        {/* <Box width="100%" mt={5} mb={5} height="25px" sx={{ backgroundColor: '#0796f5' }}></Box> */}
                        <Container  maxWidth="lg">
                            <Box mt={10} sx={{ textAlign: 'center' }}>
                                <Typography sx={{ color: '#00624F' }} variant="h1">
                                    Meet the team
                                </Typography>
                                <Typography mt={3} mb={3} variant="h5">
                                    Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up
                                    appointment - we are here for you.
                                </Typography>
                                <Grid direction="row" justifyContent="center" alignItems="center" mt={5} mb={5} container spacing={5}>
                                    {clinic?.doctorList?.slice(0, 3).map((doctor, i) => (
                                        <Grid key={doctor?.id} item xs={4}>
                                            <Box
                                                width="100%"
                                                height="400px"
                                                sx={{
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                                                    paddingTop: '15px',
                                                    borderRadius: '10%',
                                                    backgroundColor: '#00695c',
                                                    position: 'relative',
                                                }}
                                            >
                                                <Box
                                                    height="100%"
                                                    width="100%"
                                                    sx={{
                                                        borderRadius: '10%',
                                                        backgroundColor: '#00695c',
                                                        background: `url(${dentistProflePic?.src}) no-repeat center/cover`, // replace with your image path
                                                    }}
                                                ></Box>

                                                <Box
                                                    width="100%"
                                                    height="100px"
                                                    position="absolute"
                                                    bottom="0"
                                                    bgcolor="white"
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h2" color="black">
                                                        Dr. {doctor?.userDTO?.lastName}
                                                    </Typography>
                                                    <Typography mt={2} variant="h4" color="black">
                                                        {doctor?.doctorType?.replace(/_/g, ' ')}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            <Box mt={5} mb={10} sx={{ textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        borderRadius: '15px',
                                        padding: '10px 20px',
                                        border: '1px solid #00624F',
                                        backgroundColor: 'white', // Choose your color
                                        '&:hover': {
                                            backgroundColor: '#00624F', // Choose your hover color
                                        },
                                    }}
                                    href="#doctorsList"
                                >
                                    <Typography variant="h3">Book an appointment with one of our dentists</Typography>
                                </Button>
                            </Box>

                            <Box>
                                <Typography sx={{ color: '#00624F' }} variant="h3">
                                    HOW TO FIND OUR DENTAL PRACTICE
                                </Typography>
                                <Typography mt={3} mb={3} variant="h5">
                                    Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up
                                    appointment - we are here for you.
                                </Typography>
                            </Box>
                        </Container>

                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>
                                    <Box sx={{ padding: '11px' }}>
                                        <div
                                            style={{
                                                marginBottom: '15px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <ShareLocationIcon sx={{ color: '#00624F', marginRight: '8px', fontSize: 40 }} />
                                            <Typography variant="h5">{clinic?.officeLocationName}</Typography>
                                        </div>
                                        <div
                                            style={{
                                                marginBottom: '15px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginRight: '8px',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <PhoneIphoneIcon sx={{ color: '#00624F', fontSize: 40 }} />
                                            <Typography variant="h5">{clinic?.phoneNumber}</Typography>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginRight: '8px',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            <CalendarMonthIcon sx={{ color: '#00624F', fontSize: 40 }} />
                                            <Typography variant="h5">
                                                <ul style={{ listStyleType: 'none', padding: 5 }}>
                                                    <li>Mon: 8:00-20:00</li>
                                                    <li>Tue: 8:00-20:00</li>
                                                    <li>Wed: 8:00-20:00</li>
                                                    <li>Thu: 8:00-20:00</li>
                                                    <li>Fri: 8:00-20:00</li>
                                                    <li>Sat: 8:00-20:00</li>
                                                    <li>Sun: 8:00-20:00</li>
                                                </ul>
                                            </Typography>
                                        </div>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <div style={{ height: '400px', background: '#ccc' }}>
                                        <GoogleMap clinics={[]} address={clinic?.officeLocationName} />
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>

                        <Container maxWidth="lg">
                            <Box mt={5} mb={10} sx={{ textAlign: 'center' }}>
                                <Typography variant="h1">Our calendar</Typography>
                            </Box>

                            {clinic?.doctorList && clinic.doctorList.length > 0 ? (
                                <Box id="doctorsList" sx={{ height: '20%' }}>
                                    {clinic?.doctorList?.map((doctor, i) => {
                                        console.log(doctor)

                                        const availabilityList = doctor?.doctorAvailabilityDTOList
                                        const availableRange = availabilityList?.find((item) =>
                                            dayjs(new Date()).isBetween(item?.startDateTime, item?.endDateTime)
                                        )

                                        const startDate = dayjs(
                                            availableRange ? new Date() : availabilityList?.[0]?.startDateTime ?? new Date()
                                        )
                                        const isFuture = startDate?.isAfter(new Date())

                                        const endDateTime = dayjs(availableRange?.endDateTime ?? availabilityList?.[0]?.endDateTime)
                                        const availableFutureDays = startDate.add(25, 'days')
                                        const endDate =
                                            endDateTime && availableFutureDays?.isAfter(endDateTime) ? endDateTime : availableFutureDays

                                        const doctorName = `${doctor?.userDTO?.firstName} ${doctor?.userDTO?.lastName}`

                                        const isSelectedDoctor = doctor?.id === selected?.doctorId
                                        const clinicLink = '/clinic/' + doctor?.clinicId
                                        return (
                                            <Box key={doctor?.id}>
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
                                                        sx={{
                                                            mt: 3,
                                                            mb: {
                                                                sm: 0,
                                                                xs: 3,
                                                            },
                                                        }}
                                                    >
                                                        <Box>
                                                            <Avatar src={avatar?.src} alt={doctorName} sx={{ width: 100, height: 100 }} />
                                                        </Box>
                                                        <Box ml="12px">
                                                            <Typography variant="h4">
                                                                <strong>Dr. {doctorName}</strong>
                                                            </Typography>

                                                            <Typography my={1}>{doctor?.doctorType?.replaceAll('_', ' ')}</Typography>
                                                            <Typography sx={{ width: '75%', textAlign: 'justify' }} my={1}>
                                                                {doctor?.experience}
                                                            </Typography>
                                                            <Rating name="read-only" value={value} readOnly />

                                                            {/* <Divider /> */}
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        className="appointment"
                                                        display="flex"
                                                        flex={1}
                                                        sx={{
                                                            borderLeft: {
                                                                md: '1px solid #eeeeee',
                                                                xs: '0',
                                                            },
                                                            borderTop: {
                                                                md: '0',
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
                                                                    // maxDate={endDate}
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
                                                                            sm: 270,
                                                                            xs: 220,
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

                                                {i != clinic?.doctorList?.length - 1 && <Divider />}
                                            </Box>
                                        )
                                    })}
                                </Box>
                            ) : (
                                <Box key={clinic?.clinicId}>
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
                                                    <Avatar src={avatar?.src} alt={clinic?.name} sx={{ width: 75, height: 75 }} />
                                                </Box>
                                                <Box ml="12px">
                                                    <Typography variant="h4">
                                                        <Link underline="none" key={clinic?.clinicId}>
                                                            <Box display="flex" alignItems="center">
                                                                <strong style={{ marginRight: '10px', color: 'black' }}>
                                                                    {clinic?.name}
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
                                                                    width: '100px',
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
                                                        <Typography>0 appointment </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Box mt={3} mb={3} gap={1} display="flex" alignItems="center">
                                                <LocationOnIcon sx={{ color: '#329DFF' }}></LocationOnIcon>
                                                <Typography> {clinic?.officeLocationName} </Typography>
                                            </Box>

                                            <Box>
                                                <Typography>{clinic?.description}</Typography>
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
                            )}
                        </Container>
                    </>
                )}
            </Box>

            <CreateAppointment ref={ref} onClose={() => setSelected(initialState)} />
        </Layout>
    )
}

export default SingleClinic
