import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    Link,
    Table,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    Collapse,
    makeStyles,
    Paper,
    TableContainer,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import * as React from 'react'
import {} from '@material-ui/core'
import { KeyboardArrowDown } from '@material-ui/icons'

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

import CreateClinicAppointment from '../../modules/appointments/CreateClinicAppointment'
import Header2 from '../../layout/main/Header2'
import Reviews from '../../modules/clinics/Reviews'
import ClinicPicture from '../../modules/clinics/ClinicPicture'
import { GetStaticPaths } from 'next'
import { useTranslation } from 'next-i18next'
import DoctorPicture from '../../modules/Doctor/DoctorPicture'
import { useMobile } from '../../ui-component/hooks/useMobile'
import { useQuery } from 'react-query'
import axios from 'axios'

dayjs.extend(isBetween)

const initialState = {
    day: null,
    time: null,
    clinicId: null,
    clinicIsSubscribed: false,
}

const SingleClinic = () => {
    const ref = useRef(null)
    const isMobile = useMobile()

    const { isLoggedIn } = useUser(false)

    const [selected, setSelected] = useState(initialState)

    const { query } = useRouter()

    const { name } = query ?? {}

    const { data: clinic, isFetching } = useClinicByName({
        name,
        checkAuth: false,
    })

    const { t, i18n } = useTranslation('common')
    const curLang = i18n.language

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

    function getDescription(language: 'en' | 'hu', description: string): string {
        // Splitting the description based on the language tags
        const parts = description?.split(/<b>English<\/b>:|<br>\s*<b> Hungarian: <\/b>/)

        if (parts?.length < 3) {
            // If the parts array doesn't contain the expected elements, return an empty string or a default message
            return description.slice(0, 160)
        }

        let selectedDescription = ''
        if (parts == undefined) return null

        if (language === 'en') {
            // Extracting the English part, using optional chaining for safety
            selectedDescription = parts[1]?.trim()
        } else if (language === 'hu') {
            // Extracting the Hungarian part, using optional chaining for safety
            selectedDescription = parts[2]?.trim()
        }

        // Returning the first 160 characters of the selected part
        return selectedDescription.slice(0, 160)
    }

    // Example usage
    //   const description = getDescription('hu',clinic?.description)

    //   const description = '<b>English</b>: Our dental clinic specializes in general dentistry, offering a comprehensive range of treatments tailored to meet the unique needs of every patient. Our team of experienced professionals is dedicated to providing exceptional care in a comfortable environment, ensuring your dental health is in the best hands. <br> <b> Hungarian: </b> A fogászati rendelőnk általános fogászatra szakosodott, széleskörű kezeléseket kínálva, amelyeket minden páciens egyedi igényeihez igazítanak. Tapasztalt szakembereink elkötelezettek a kiváló ellátás nyújtása mellett egy kényelmes környezetben, garantálva, hogy fogászati egészsége a legjobb kezekben van.';

    const description = getDescription('hu', clinic?.description)

    const useStyles = makeStyles((theme) => ({
        tableContainer: {
            boxShadow: 'none',
            border: 'none',
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
        },
        table: {
            borderCollapse: 'collapse',
        },
        headerCell: {
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '0.875rem',
            padding: theme.spacing(1),
        },
        iconCell: {
            padding: theme.spacing(0, 1),
        },
        icon: {
            transition: theme.transitions.create('transform'),
            transform: 'rotate(0deg)',
            '&.expanded': {
                transform: 'rotate(180deg)',
            },
        },
        categoryCell: {
            borderBottom: 'none',
            padding: theme.spacing(1),
            fontWeight: 'bold',
        },
        treatmentName: {
            borderBottom: 'none',
            fontSize: '1rem',
            padding: theme.spacing(1),
        },
        treatmentCost: {
            borderBottom: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            padding: theme.spacing(1),
        },
        collapseContainer: {
            padding: 0,
        },
    }))
    // const treatmentsData = [
    //     { name: 'ORTO | root canal' },
    //     { name: 'ORTO | whitening' },
    //     { name: 'PIMPO | tooth removal' },
    //     { name: 'Regular Checkup' }, // No prefix, goes to OTHER
    // ]

    const { data: treatmentsData } = useQuery(['Treatment', clinic], async ({ signal }) => {
        const result = await axios(`/api/clinics/${clinic?.clinicId}/treatments`, { signal })
        return result.data
    })

    const categorizeTreatments = (treatments) => {
        const categories = treatments?.reduce((acc, treatment) => {
            const prefixMatch = treatment?.name?.match(/(.*?)\s*\|\s*(.*)/)
            const category = prefixMatch ? prefixMatch[1] : 'OTHER'
            const name = prefixMatch ? prefixMatch[2] : treatment?.name

            if (!acc[category]) {
                acc[category] = []
            }
            acc[category].push({ ...treatment, name })

            return acc
        }, {})
        return categories
    }

    const TreatmentTable = ({ treatmentsData }) => {
        const classes = useStyles()

        // Assume treatmentsData is already fetched and categorized
        const categorizedTreatments = categorizeTreatments(treatmentsData)

        return (
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="collapsible table">
                    <TableBody>
                        {treatmentsData &&
                            Object.entries(categorizedTreatments).map(([category, treatments]) => (
                                <CategoryRow key={category} category={category} treatments={treatments} classes={classes} />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const CategoryRow = ({ category, treatments, classes }) => {
        const [open, setOpen] = useState(false)

        return (
            <>
                <TableRow>
                    <TableCell className={classes.iconCell}>
                        <IconButton onClick={() => setOpen(!open)} size="small">
                            <KeyboardArrowDown className={`${classes.icon} ${open ? 'expanded' : ''}`} />
                        </IconButton>
                    </TableCell>
                    <TableCell className={classes.categoryCell} colSpan={2}>
                        {category}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Table size="small">
                                <TableBody>
                                    {treatments.map((treatment) => (
                                        <TableRow key={treatment.id}>
                                            <TableCell className={classes.treatmentName}>{treatment.name}</TableCell>
                                            <TableCell className={classes.treatmentCost}>{treatment.cost} HUF</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        )
    }

    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify({
          "@context": "http://schema.org/",
          "@type": "Product",
          "name": clinic?.title,
          "description": clinic?.description,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue" : "4.0",
            "ratingCount" : "51",
            "reviewCount" : "51",
            "worstRating" : "1",
            "bestRating" : "5"
          }
        });
    
        document.head.appendChild(script);
    
        return () => {
          document.head.removeChild(script);
        };
      }, []);

    return (
        <Layout title={clinic?.name} description={description}>
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
                                    flexDirection={{ md: 'row', xs: 'column' }}
                                    sx={{
                                        alignItems: 'center',
                                        mt: 3,
                                        mb: 10,
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
                                    >
                                        {isMobile ? (
                                            // Mobile layout: ClinicPicture to the right of the clinic name
                                            <>
                                                <Box display="flex" flexDirection="row" alignItems="center">
                                                    <Box
                                                        width="100px"
                                                        height="100px"
                                                        borderRadius="50%"
                                                        sx={{
                                                            p: 2,
                                                            border: '1px solid #329DFF',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            marginRight: '10px',
                                                        }}
                                                    >
                                                        <ClinicPicture clinic={clinic} />
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="h1" fontSize="36px">
                                                            <strong>{clinic?.name}</strong>
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Typography mt="40px" lineHeight="24px">
                                                    <div dangerouslySetInnerHTML={{ __html: clinic?.description || '' }} />
                                                </Typography>
                                            </>
                                        ) : (
                                            // Default layout for larger screens
                                            <>
                                                <Box flex={1}>
                                                    <Typography variant="h1" fontSize="36px">
                                                        <strong>{clinic?.name}</strong>
                                                    </Typography>
                                                    <Typography mt="40px" lineHeight="24px">
                                                        <div dangerouslySetInnerHTML={{ __html: clinic?.description || '' }} />
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    width="350px"
                                                    height="350px"
                                                    borderRadius="50%"
                                                    sx={{
                                                        p: 2,
                                                        border: '1px solid #329DFF',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <ClinicPicture clinic={clinic} />
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            {!!doctors?.length && (
                                <>
                                    <Box mt="100px" sx={{ textAlign: 'center' }}>
                                        <Typography sx={{ color: '#00624F' }} variant="h1">
                                            Találkozni a csapattal
                                        </Typography>
                                        <Typography mt={3} mb={3} variant="h5">
                                            Mindegy, hogy professzionális fogtisztításra van szüksége, implantátum iránt érdeklődik, vagy
                                            egyszerűen csak egy vizsgálatra van szüksége – mi állunk rendelkezésére.
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
                                                const user = doctor?.userDTO
                                                const doctorUrl =
                                                    `/fogorvosok/` + user?.firstName?.toLowerCase() + `-` + user?.lastName?.toLowerCase()
                                                return (
                                                    <Grid key={doctor?.id} item xs={12} sm={6} md={4} lg={3}>
                                                        <Box
                                                            width="100%"
                                                            height="400px"
                                                            sx={{
                                                                borderRadius: '8px',
                                                                position: 'relative',
                                                                border: '1px solid #D3D3D3',
                                                            }}
                                                        >
                                                            {/* Your DoctorPicture component here, ensure it's responsive */}
                                                            <DoctorPicture
                                                                width="100%"
                                                                height="400px"
                                                                sx={{
                                                                    borderRadius: '8px',
                                                                    position: 'relative',
                                                                    border: '1px solid #D3D3D3',
                                                                }}
                                                                doctor={doctor}
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
                                                                <Typography
                                                                    variant="h2"
                                                                    color="black"
                                                                    sx={{ fontSize: { xs: '18px', sm: '20px', md: '24px' } }}
                                                                >
                                                                    Dr. {doctor?.userDTO?.lastName}
                                                                </Typography>
                                                                <Typography
                                                                    variant="h4"
                                                                    color="black"
                                                                    sx={{ fontSize: { xs: '16px', sm: '18px' } }}
                                                                >
                                                                    {doctor?.doctorType?.replace('_', ' ')}
                                                                </Typography>
                                                                <Link href={doctorUrl} style={{ textDecoration: 'none' }}>
                                                                    <Button
                                                                        color="primary"
                                                                        variant="contained"
                                                                        sx={{
                                                                            padding: '8px 24px',
                                                                            borderRadius: '8px',
                                                                            color: 'white',
                                                                            marginTop: '8px',
                                                                            fontSize: { xs: '14px', sm: '16px' },
                                                                        }}
                                                                    >
                                                                        Időpont egyeztetés
                                                                    </Button>
                                                                </Link>
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
                                <Typography variant="h3" sx={{ color: '#00624F', fontSize: { xs: '24px', md: '30px' } }}>
                                    KEZELÉSEINK – AMIT KÍNÁLUNK
                                </Typography>
                                <Typography mt={3} mb={3} variant="h5" sx={{ fontSize: { xs: '16px', sm: '18px' } }}>
                                    Below you can find list of dental treatment our clinic provides. For more information, please contact
                                    us.
                                </Typography>

                                <TreatmentTable treatmentsData={treatmentsData} />
                            </Box>

                            <Box mt="150px" textAlign="center">
                                <Typography variant="h3" sx={{ color: '#00624F', fontSize: { xs: '24px', md: '30px' } }}>
                                    HOGYAN MEGTALÁLHATJUK FOGORVOSI RENDELŐNKET
                                </Typography>
                                <Typography mt={3} mb={3} variant="h5" sx={{ fontSize: { xs: '16px', sm: '18px' } }}>
                                    Az alábbiakban megtalálja a klinikánk által nyújtott fogászati kezelések listáját. További információért
                                    forduljon minket.
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' }, // Column layout on small screens
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: { xs: '20px', md: '45px' }, // Adjust gap for different screen sizes
                                    paddingX: { xs: '20px', md: '150px' }, // Adjust padding for different screen sizes
                                }}
                            >
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

                                <Box
                                    sx={{
                                        height: { xs: '300px', md: '360px' }, // Adjust height for different screen sizes
                                        width: { xs: '100%', sm: '450px', md: 'auto' }, // Fixed width for small screens, auto for larger
                                        background: '#ccc',
                                        flex: { md: 1 }, // flex property active only for md and larger screens
                                        borderRadius: '8px',
                                        overflow: 'hidden', // Ensure the map doesn't overflow the container
                                    }}
                                >
                                    <GoogleMap clinics={[]} address={clinic?.officeLocationName} />
                                </Box>
                            </Box>

                            <Box mt="150px" sx={{ textAlign: 'center', paddingX: { xs: '20px', md: '150px' } }}>
                                <Typography variant="h3" sx={{ color: '#00624F', fontSize: { xs: '24px', md: '30px' } }}>
                                    A naptárunk
                                </Typography>
                                <Typography mb={5} mt={1} variant="h5" sx={{ fontSize: { xs: '16px', sm: '18px' } }}>
                                    {t('labelSelectDateAndTime')}
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

                            <Reviews curLang={curLang} />
                        </Container>
                    </>
                )}
            </Box>

            <CreateClinicAppointment ref={ref} onClose={() => setSelected(initialState)} />
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
        fallback: 'blocking', //indicates the type of fallback
    }
}
