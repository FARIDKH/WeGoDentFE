import { Avatar, Box, Container, Divider, Typography, Rating, Tabs, Tab, Grid, Link } from '@material-ui/core'
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

import { useClinic } from '../../hooks/useClinic'
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

const Clinic = () => {
    const ref = useRef(null)

    const [selected, setSelected] = useState(initialState)

    const { query } = useRouter()

    const { id } = query ?? {}

    const [value, setValue] = useState<number | null>(4)

    

    const { data: clinics, isFetching } = useClinic({
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
            <Container maxWidth="lg">
                <Box minHeight="50vh" my={4}>
                    {isFetching && id != undefined ? (
                        <Loading size={60} />
                    ) : !clinics?.length ? (
                        <NoResult />
                    ) : (
                        <Box>
                            {clinics?.map((clinic, i) => {
                                console.log("clinic + ", clinic.doctorList)
                                const doctors = clinic?.doctorList
                                {doctors?.map((doctor, i) => {
                                // const availabilityList = doctor?.doctorAvailabilityDTOList
                                // const availableRange = availabilityList?.find((item) =>
                                //     dayjs(new Date()).isBetween(item?.startDateTime, item?.endDateTime)
                                // )

                                const startDate = dayjs(new Date())
                                // const isFuture = startDate?.isAfter(new Date())

                                // const endDateTime = dayjs(availableRange?.endDateTime ?? availabilityList?.[0]?.endDateTime)
                                // const availableFutureDays = startDate.add(25, 'days')
                                // const endDate = endDateTime && availableFutureDays?.isAfter(endDateTime) ? endDateTime : availableFutureDays

                                const doctorName = `${doctor?.userDTO?.firstName} ${doctor?.userDTO?.lastName}`
                                const doctorLink = '/doctors/' + doctor?.id
                                const isSelectedDoctor = doctor?.id === selected?.doctorId
                                console.log(doctor)

                                return (
                                    // <Box key={doctor?.id}>
                                       
                                    //     <Box
                                    //         display="flex"
                                    //         sx={{
                                    //             flexDirection: {
                                    //                 sm: 'row',
                                    //                 xs: 'column',
                                    //             },
                                    //         }}
                                    //     >
                                    //         <Box
                                    //             className="doctorInfo"
                                    //             display="flex"
                                    //             flex={1}
                                    //             sx={{
                                    //                 mt: 3,
                                    //                 mb: {
                                    //                     sm: 0,
                                    //                     xs: 3,
                                    //                 },
                                    //             }}
                                    //         >
                                    //             <Box>
                                    //                 <Avatar src={avatar?.src} alt={doctorName} sx={{ width: 75, height: 75 }} />
                                    //             </Box>
                                    //             <Box ml="12px">
                                    //                 <Typography variant="h4">
                                    //                     <Link key={doctor.id} href={doctorLink}>
                                    //                         {' '}
                                    //                         <strong>Dr. {doctorName}</strong>{' '}
                                    //                     </Link>
                                    //                 </Typography>
                                    //                 <Typography my={1}>{doctor?.doctorType?.replaceAll('_', ' ')}</Typography>
                                    //                 <Typography
                                    //                     my={1}
                                    //                     sx={{
                                    //                         width: '75%',
                                    //                         textAlign: 'justify',
                                    //                         // textJustify: 'innerWord'
                                    //                     }}
                                    //                 >
                                    //                     {doctor?.experience}
                                    //                 </Typography>
                                    //                 <Typography>Office Location: {doctor?.officeLocationName}</Typography>
                                    //             </Box>
                                    //         </Box>
                                    //         <Box
                                    //             className="appointment"
                                    //             display="flex"
                                    //             flex={1}
                                    //             sx={{
                                    //                 borderLeft: {
                                    //                     sm: '1px solid #eeeeee',
                                    //                     xs: '0',
                                    //                 },
                                    //                 borderTop: {
                                    //                     sm: '0',
                                    //                     xs: '1px solid #eeeeee',
                                    //                 },
                                    //             }}
                                    //         >
                                    //             <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    //                 <Box flex={2}>
                                    //                     <DateCalendar
                                    //                         views={['day']}
                                    //                         disablePast
                                    //                         minDate={startDate}
                                    //                         value={isSelectedDoctor ? selected.day : null}
                                    //                         onChange={(value) =>
                                    //                             setSelected((prev) => ({
                                    //                                 ...prev,
                                    //                                 day: value,
                                    //                                 doctorId: doctor?.id,
                                    //                             }))
                                    //                         }
                                    //                         sx={{
                                    //                             width: {
                                    //                                 sm: 320,
                                    //                                 xs: 290,
                                    //                             },
                                    //                         }}
                                    //                     />
                                    //                 </Box>
                                    //                 <Box flex={1}>
                                    //                     <DigitalClock
                                    //                         // value={isSelectedDoctor ? selected.time : null}
                                    //                         // minTime={dayjs(startDate.format('YYYY-MM-DDT07:00'))}
                                    //                         // maxTime={dayjs(endDate.format('YYYY-MM-DDT18:00'))}
                                    //                         // timeStep={60}
                                    //                         // skipDisabled
                                    //                         // disablePast={!isFuture}
                                    //                         sx={{
                                    //                             maxHeight: '300px',
                                    //                             '& .MuiDigitalClock-item': {
                                    //                                 padding: {
                                    //                                     sm: '8px 16px',
                                    //                                     xs: 0,
                                    //                                 },
                                    //                                 fontSize: {
                                    //                                     sm: 'inherit',
                                    //                                     xs: '0.75rem',
                                    //                                 },
                                    //                             },
                                    //                         }}
                                    //                         onChange={(value) =>
                                    //                             setSelected((prev) => ({
                                    //                                 ...prev,
                                    //                                 time: value,
                                    //                                 doctorId: doctor?.id,
                                    //                             }))
                                    //                         }
                                    //                     />
                                    //                 </Box>
                                    //             </LocalizationProvider>
                                    //         </Box>
                                    //     </Box>

                                    //     {i != doctors?.length - 1 && <Divider />}
                                    // </Box>
                                    1
                                )
                            })}
                        })}
                        </Box>
                    )}
                </Box>

                <CreateAppointment ref={ref} onClose={() => setSelected(initialState)} />
            </Container>
        </Layout>
    )
}

export default Clinic
