import { Avatar, Box, Container, Divider, Typography, Rating, Tabs, Tab, Grid, Link, Button, ListItemAvatar } from '@material-ui/core'
import { useRouter } from 'next/router'
// import Rating from '@mui/material/Rating';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
import * as React from 'react'


import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ShieldIcon from '@mui/icons-material/Shield'
import LocationCityIcon from '@mui/icons-material/LocationCity'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PeopleIcon from '@mui/icons-material/People'
import BackHandIcon from '@mui/icons-material/BackHand'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import GoogleMap from '../../ui-component/GoogleMap';


import { useClinic } from '../../hooks/useClinic'
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
import Image from 'next/image';
import styles from '../../assets/scss/CustomBox.module.scss';
import defaultClinicPic from '../../public/clinic.png'  



dayjs.extend(isBetween)

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

const initialState = {
    day: null,
    time: null,
    doctorId: null,
}

const SingleClinic = () => {
    const ref = useRef(null)

    const [selected, setSelected] = useState(initialState)

    const { query } = useRouter()

    const { id } = query ?? {}

    const [value, setValue] = useState<number | null>(4)

    

    const { data: clinic, isFetching } = useClinic({
        id,
        checkAuth: false,
    })
    const [tabValue, setTabValue] = useState(0)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    useEffect(() => {
        if (Object.values(selected).every((val) => !!val)) {
            ref?.current?.open(selected)
        }
    }, [selected])

    return (
        <Layout>
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
                                    >
                                        <Box >
                                            <Avatar  src={avatarClinic?.src} alt={clinic?.name} sx={{ width: 250, height: 250 }} />
                                        </Box>
                                        <Box ml="12px">
                                            <Typography variant="h1">
                                                <strong>{clinic?.name}</strong>
                                            </Typography>
                                            
                                            <Typography sx={{ width: '75%', textAlign: 'justify' }} my={1}>
                                                {clinic?.officeLocationName}
                                            </Typography>
                                            <Rating name="read-only" value={value} readOnly />
                                            

                                            
                                            {/* <Divider /> */}
                                        </Box>
                                        <Box mt={5}>
                                            <Typography style={{
                                                    fontSize: '16px',
                                                    lineHeight: '1.5',
                                                    color: '#333',
                                                    margin: '0 0 16px'
                                                }}>
                                                    At <span style={{ fontWeight: 'bold' }}>  {clinic?.name} </span>, we prioritize your dental health and smile. Nestled in the heart of <span style={{ fontStyle: 'italic' }}> {clinic?.officeLocationName} </span>, our state-of-the-art dental facility offers a serene and welcoming environment, equipped with the latest in dental technology. Our team of dedicated professionals is committed to providing personalized care, ensuring that each patient experiences optimal oral health and a radiant smile. Whether you're in for a routine check-up, a cosmetic procedure, or more intensive treatment, we strive to exceed your expectations, making every visit a comfortable and rewarding experience.
                                            </Typography>
                                        </Box>
                                        
                                    </Box>
                                </Box>

                            </Box>
                        </Container>

                        <Box width="100%" mt={5} mb={5} height="25px" sx={{ backgroundColor:"#0796f5" }}></Box>    
                        <Container maxWidth="lg">      

                            <Box sx={{ textAlign : "center"}}>                                
                              <Typography sx={{ color:"#00624F" }} variant="h1">Meet the team</Typography>    
                              <Typography mt={3} mb={3} variant="h5">Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up appointment - we are here for you.</Typography>    
                              <Grid direction="row" justifyContent="center" alignItems="center" mt={5} mb={5} container spacing={5}>
                                
                                {clinic?.doctorList?.slice(0, 3).map((doctor, i) => (                           
                                    <Grid item xs={4}>
                                        <Box width="100%" height="400px" sx={{ 
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)' ,
                                            paddingTop:"15px", borderRadius:"10%",backgroundColor : "#00695c", position: 'relative' }}>
                                            <Box
                                                height="100%" 
                                                width="100%" 
                                                sx={{ 
                                                    borderRadius: "10%", 
                                                    backgroundColor : "#00695c",
                                                    background: `url(${dentistProflePic?.src}) no-repeat center/cover` // replace with your image path
                                                }}
                                            ></Box>

                                            <Box
                                                width="100%" 
                                                height="100px" 
                                                position="absolute" 
                                                bottom="0" 
                                                bgcolor="white"
                                                sx={{  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                <Typography variant="h2" color="black">
                                                    Dr. {doctor?.userDTO?.lastName}
                                                </Typography>
                                                <Typography  mt={2} variant="h4" color="black">
                                                    {doctor?.doctorType?.replace(/_/g, ' ')}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                                    
                              </Grid>
                            </Box>



                            <Box mt={5} mb={10} sx={{ textAlign : "center"}}>                                
                            <Button 
                                    variant="contained"
                                    sx={{ 
                                        borderRadius: '15px',
                                        padding: '10px 20px',
                                        border: "1px solid #00624F",
                                        backgroundColor: 'white', // Choose your color
                                        '&:hover': {
                                            backgroundColor: '#00624F', // Choose your hover color
                                        }
                                    }}
                                    href="#doctorsList"
                                >
                                    <Typography variant="h3">Book an appointment with one of our dentists</Typography>
                                </Button>
                            </Box>  

                            <Box>
                                <Typography sx={{ color:"#00624F" }} variant="h3">HOW TO FIND OUR DENTAL PRACTICE</Typography>    
                                <Typography mt={3} mb={3} variant="h5">Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up appointment - we are here for you.</Typography>    
                              
                            </Box>
                        </Container>

                                    
                            <Box>
                                <Grid  direction="row"  container>
                                    <Grid  height="400px" xs={6}>
                                        <Box width="100%" sx={{ padding: "11px",  }}>
                                            <Box>
                                                <ul style={{ textAlign: 'right', listStyleType: 'none', padding: '25px' }}>
                                                    <li  style={{ fontSize: "20px", margin:"10px"}}>
                                                        <ShareLocationIcon  sx={{ color:"#00624F", fontSize: 40 }}/> Budapest, Hungary, Garay utca 56.
                                                    </li>
                                                    <li style={{ fontSize: "20px", margin:"10px"}}>
                                                        <PhoneIphoneIcon sx={{ color:"#00624F", fontSize: 40 }} /> +36203590741
                                                    </li>
                                                    <li  style={{ fontSize: "20px", margin:"10px"}}>
                                                        <CalendarMonthIcon sx={{ color:"#00624F", fontSize: 40 }} /> 
                                                        <ul style={{  listStyleType: 'none', padding: 5 }}>
                                                            <li style={{ marginTop:"5px"}}>Mon: 8:00-20:00</li>
                                                            <li style={{ marginTop:"5px"} }>Tue: 8:00-20:00</li>
                                                            <li style={{ marginTop:"5px"}}>Wed: 8:00-20:00</li>
                                                            <li style={{ marginTop:"5px"}}>Thu: 8:00-20:00</li>
                                                            <li style={{ marginTop:"5px"}}>Fri: 8:00-20:00</li>
                                                            <li style={{ marginTop:"5px"}}>Sat: 8:00-20:00</li>
                                                            <li style={{ marginTop:"5px"}}>Sun: 8:00-20:00</li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid height="400px" xs={6}>
                                        <GoogleMap address="Budapest, Hungary" />

                                    </Grid>
                                </Grid>
                            </Box>

                        <Container maxWidth="lg">      
                            <Box mt={5} mb={10} sx={{ textAlign : "center"}}>                                
                            
                                <Typography variant="h1">Our calendar</Typography>
                                
                            </Box>  


                                <Box id="doctorsList" sx={{ height :"20%"}}>
                                        {
                                            clinic?.doctorList?.map((doctor, i) => {
                                            
                                                console.log(doctor)

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
                            
                        </Container>
                        
                        </>
                    )}
                </Box>

                <CreateAppointment ref={ref} onClose={() => setSelected(initialState)} />
            
        </Layout>
    )
}

export default SingleClinic
