import { Avatar, Box, Container, Divider, Typography, Rating, Tabs, Tab, Grid } from '@material-ui/core'
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

import { useDoctor } from '../../hooks/useDoctor'
import Layout from '../../layout/main/Layout'
import Loading from '../../ui-component/Loading'
import NoResult from '../../ui-component/NoResult'

import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DigitalClock, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import avatar from '../../assets/images/avatar.png'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useEffect, useRef, useState } from 'react'
import CreateAppointment from '../../modules/main/appointments/CreateAppointment'
import Header2 from '../../layout/main/Header2'

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

const SingleDoctor = () => {
    const ref = useRef(null)

    const [selected, setSelected] = useState(initialState)

    const { query } = useRouter()

    const { id } = query ?? {}

    const [value, setValue] = useState<number | null>(4)

    const { data: doctors, isFetching } = useDoctor({
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
            <Header2 />
            <Container maxWidth="lg">
                <Box minHeight="50vh" my={4}>
                    {isFetching && id != undefined ? (
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
                                                    <Avatar src={avatar?.src} alt={doctorName} sx={{ width: 150, height: 150 }} />
                                                </Box>
                                                <Box ml="12px">
                                                    <Typography variant="h4">
                                                        <strong>Dr. {doctorName}</strong>
                                                    </Typography>
                                                    <Typography my={1}>{doctor?.doctorType?.replaceAll('_', ' ')}</Typography>
                                                    <Typography sx={{ "width" : "75%", "textAlign" : "justify", "textJustify" : "innerWord" }} my={1}>{doctor?.experience}</Typography>
                                                    <Rating name="read-only" value={value} readOnly />
                                                    <Typography>Office Location: {doctor?.officeLocationName}</Typography>
                                                    {/* <Divider /> */}
                                                    <Box sx={{ marginTop: '25px', borderBottom: 1, borderColor: 'divider' }}>
                                                        <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                                                            <Tab label="Address" {...a11yProps(0)} />
                                                            <Tab label="Treatments" {...a11yProps(1)} />
                                                            <Tab label="Reviews" {...a11yProps(2)} />
                                                        </Tabs>
                                                    </Box>
                                                    <CustomTabPanel value={tabValue} index={0}>
                                                        {/* <Box> */}
                                                        <List>
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemIcon>
                                                                        <ShieldIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary="Insurances accepted: TAJ card, Generali" />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemIcon>
                                                                        <LocationCityIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary="Egyetem ter 7, Budapest" />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemIcon>
                                                                        <CreditCardIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary="Accepted payments: Cash, Credit card" />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemIcon>
                                                                        <PeopleIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary="Accepted age group: Adult, Children of any age" />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemIcon>
                                                                        <BackHandIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary="The office is ventilated and disinfected after each appointment" />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        </List>
                                                        {/* </Box> */}
                                                    </CustomTabPanel>
                                                    <CustomTabPanel value={tabValue} index={1}>
                                                        <List>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Tooth Withdrawal" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Tooth Whitening" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Dental Fillings" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Root Canal Treatment" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Dental Implants" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Gum Disease Treatment" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Orthodontics (Braces)" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Periodontal Surgery" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Dental Crowns" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Dental Bridges" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Dental Veneers" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Oral Cancer Screening" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Dentures" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Tooth Extractions" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Tooth Bonding" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Dental Sealants" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Nightguards for Bruxism" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Mouthguards for Sports" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Dental Cleaning" />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemIcon>
                                                                    <ChevronRightIcon />
                                                                </ListItemIcon>
                                                                <ListItemText primary="Pediatric Dentistry" />
                                                            </ListItem>
                                                        </List>
                                                    </CustomTabPanel>
                                                    <CustomTabPanel value={tabValue} index={2}>
                                                        <Grid mt={5} wrap="nowrap" container spacing={1}>
                                                            <Grid item>
                                                                <Avatar>AP</Avatar>
                                                            </Grid>
                                                            <Grid item xs={12} sm>
                                                                <Typography gutterBottom variant="subtitle1" component="div">
                                                                    a.....p
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    27 July 2023
                                                                </Typography>
                                                                <Typography>
                                                                    I had him veneer, apart from that, I had a bridge and tooth extraction,
                                                                    and I also had a cyst removal. He is a doctor who examines his patient
                                                                    very well, he does what he can to save the teeth before the procedure in
                                                                    this process and then proceeds to the procedures to be done, I am very
                                                                    pleased with this aspect, I am still his patient at the moment, I
                                                                    continue my treatment.
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid mt={5} wrap="nowrap" container spacing={1}>
                                                            <Grid item>
                                                                <Avatar>SD</Avatar>
                                                            </Grid>
                                                            <Grid item xs={12} sm>
                                                                <Typography gutterBottom variant="subtitle1" component="div">
                                                                    s.....d
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    12 June 2023
                                                                </Typography>
                                                                <Typography>
                                                                    I had him fill and veneer. In this process, I was very pleased with his
                                                                    interest and interest in his patient, as well as his experience in the
                                                                    field, and I still continue my process, I go from time to time at the
                                                                    moment, I continue my treatment.
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CustomTabPanel>
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

export default SingleDoctor
