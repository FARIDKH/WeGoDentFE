import { Avatar, Box, Container, Divider, Typography, Rating, Tabs, Tab, Grid, Link } from '@material-ui/core'
import { useRouter } from 'next/router'
// import Rating from '@mui/material/Rating';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
import * as React from 'react'

import useUser from '../../lib/useUser'
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

import { useDoctorByName } from '../../hooks/useDoctorByName'
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
import { useTranslation } from 'next-i18next'
import { apiUrl } from '../../lib/fetchJson'
import DoctorPicture from '../../modules/Doctor/DoctorPicture'


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

    const { t, i18n } = useTranslation('common')
    const curLang = i18n.language
    const { query } = useRouter()

    const { name } = query ?? {}
    const { isLoggedIn } = useUser(false)

    const [value, setValue] = useState<number | null>(4)

    const { data: doctors, isFetching } = useDoctorByName({
        name,
        checkAuth: false,
    })

    const [tabValue, setTabValue] = useState(1)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

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

    return (
        <Layout>
            <Header2 showForm={false} />
            <Container maxWidth="lg">
                <Box minHeight="50vh" my={4}>
                    {isFetching && name != undefined ? (
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
                                const clinicLink = '/clinics/' + doctor?.clinicId
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
                                                
                                                sx={{
                                                    mt: 3,
                                                    mb: {
                                                        sm: 0,
                                                        xs: 3,
                                                    },
                                                }}
                                            >
                                                <Box 
                                                display="flex"
                                                flexWrap="wrap"
                                                alignItems="center"
                                                flex={1}
                                                >
                                                    <Box sx={{ width: "150px", height: "150px", borderRadius:"100%" }} >
                                                        <DoctorPicture
                                                            doctor={doctor}/>
                                                    </Box>
                                                    <Box ml="12px">
                                                        <Typography variant="h4">
                                                            <strong>Dr. {doctorName}</strong>
                                                        </Typography>

                                                        <Typography my={1}>{doctor?.doctorType?.replaceAll('_', ' ')}</Typography>

                                                        <Rating name="read-only" value={value} readOnly />
                                                        <Typography sx={{ mt: '10px', mb: '10px' }}>
                                                            Klinika helye: {doctor?.officeLocationName}
                                                        </Typography>
                                                        <Typography>
                                                            Dolgozik
                                                            <Link
                                                                sx={{ ml: '10px' }}
                                                                rel="alternate"
                                                                hrefLang={curLang}
                                                                key={doctor?.clinicId}
                                                                href={clinicLink}
                                                            >
                                                                {doctor?.clinicName}
                                                            </Link>
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ marginTop: '25px', width: '100%' }}>
                                                    <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example">
                                                        <Tab label="Orvosról" {...a11yProps(0)} />
                                                        <Tab label="Munkahely" {...a11yProps(1)} />
                                                        <Tab label="Kezelések" {...a11yProps(2)} />
                                                        <Tab label="Vélemények" {...a11yProps(3)} />
                                                    </Tabs>
                                                    <CustomTabPanel value={tabValue} index={0}>
                                                        <Typography sx={{ width: '75%', textAlign: 'justify' }} my={1}>
                                                            {doctor?.experience}
                                                        </Typography>
                                                    </CustomTabPanel>
                                                    <CustomTabPanel value={tabValue} index={1}>
                                                        {/* <Box> */}
                                                        <List>
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemIcon>
                                                                        <ShieldIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary="Elfogadott biztosítások: TAJ kártya, Generali" />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemIcon>
                                                                        <LocationCityIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary={doctor?.officeLocationName}/>
                                                                </ListItemButton>
                                                            </ListItem>
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemIcon>
                                                                        <CreditCardIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary="Elfogadott fizetések: készpénz, bankkártya" />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemIcon>
                                                                        <PeopleIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary="Elfogadott korcsoport: Felnőtt, Gyerekek bármilyen életkortól" />
                                                                </ListItemButton>
                                                            </ListItem>
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemIcon>
                                                                        <BackHandIcon />
                                                                    </ListItemIcon>
                                                                    <ListItemText primary="Az irodát minden időpont után szellőztetik és fertőtlenítik" />
                                                                </ListItemButton>
                                                            </ListItem>
                                                        </List>
                                                        {/* </Box> */}
                                                    </CustomTabPanel>
                                                    <CustomTabPanel value={tabValue} index={2}>
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
                                                    <CustomTabPanel value={tabValue} index={3}>
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
                                                                Volt neki furnér, ezen kívül volt hidat és foghúzást,
                                                                     és volt egy ciszta eltávolítás is. Ő egy orvos, aki megvizsgálja a betegét
                                                                     Nagyon jól, mindent megtesz a fogak megmentéséért a beavatkozás előtt
                                                                     ezt a folyamatot, majd folytatja az elvégzendő eljárásokat, nagyon vagyok
                                                                     elégedett ezzel a szemponttal, jelenleg is a páciense vagyok, én
                                                                     folytassam a kezelést.
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
                                                                Megtöltettem és bevontam. Ebben a folyamatban nagyon meg voltam elégedve az övével
                                                                     érdeklődését és érdeklődését páciense iránt, valamint tapasztalatait a
                                                                     területen, és továbbra is folytatom a folyamatot, időnként elmegyek a
                                                                     pillanatban folytatom a kezelést.
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CustomTabPanel>
                                                </Box>
                                            </Box>

                                            <Box mt="25px" sx={{ textAlign: 'center', paddingX: '75px' }}>
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
                                                        {true ? (
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
                                                                                day: value,
                                                                                doctorId: doctor?.id,
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
                                                                            {blurPhoneNumber(doctor?.phoneNumber)}
                                                                        </Typography>
                                                                    ) : (
                                                                        <Typography variant="h1">{doctor?.phoneNumber}</Typography>
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
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
