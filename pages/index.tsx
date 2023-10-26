import { Box, Button, Container, InputAdornment, makeStyles, Typography, Grid } from '@material-ui/core'
import IconSearch from '@material-ui/icons/Search'
import Layout from '../layout/main/Layout'

import Image from 'next/image'

import timePic from '../public/time-1.png'
import createAccountPic from '../public/create-account-form-1.png'
import holdingPhonePic from '../public/holding-phone-colour-1.png'

import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineDot from '@mui/lab/TimelineDot'
import { FormControl, InputLabel, FormHelperText, Input } from '@mui/material'

import * as React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

import Header from '../layout/main/Header'
import SearchForm from '../layout/main/SearchForm'

const useStyle = makeStyles((theme) => ({
    searchWrapper: {
        border: '1px solid white',
        borderRadius: '50px',
        width: '73%',
        boxShadow: theme.shadows[4],
        [theme.breakpoints.down('md')]: {
            width: '100%',
        },
        [theme.breakpoints.down('sm')]: {
            border: 0,
            boxShadow: 'none',
        },
    },
    selectDoctorType: {
        height: '32px',
        width: '30%',
        background: 'transparent',
        marginRight: '10px',
        borderRadius: 0,
        borderRight: '10px solid #D9D9D9',
        '& .MuiSelect-root': {
            padding: '4px',
            paddingRight: '32px',
            paddingLeft: '16px',
            background: 'transparent',
        },
        '& fieldset': {
            border: 0,
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            border: '.5px solid black',
            borderRadius: '50px',
            '& .MuiSvgIcon-root': {
                fill: 'black',
            },
            marginBottom: 10,
            boxShadow: theme.shadows[4],
        },
    },
    inputOfficeLocation: {
        width: 'calc(70% - 10px)',

        '& .MuiOutlinedInput-root': {
            background: 'transparent',
            height: '32px',
            '& input.MuiOutlinedInput-input': {
                background: 'transparent',
            },

            '& fieldset': {
                border: 0,
            },
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            border: '.5px solid black',
            borderRadius: '50px',
            boxShadow: theme.shadows[4],
            '& .MuiOutlinedInput-input::placeholder': {
                color: 'white',
            },
        },
    },
    bookFormControl: {
        fontSize: '20px',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    },
}))

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
        }
    }
}

const HomePage = () => {
    const classes = useStyle()

    const { t,i18n } = useTranslation('common')
    const curLang = i18n.language;

    var metaDescription = "Finding a dentist at Wegodent is quick and easy! Find a practice near you and protect your teeth with us!";
    var metaTitle = "Wegodent - Easy access to dentist near you";
    if (curLang === 'hu') {
        metaDescription = "Wegodent - nél fogorvos keresése gyors és egyszerű! Találjon közeli rendelőt és óvja fogait velünk!";
        metaTitle = "Wegodent - A fogorvos elérése egyszerűen";
    }


    return (
        <Layout description={metaDescription} title={metaTitle}>
            <Box className="background-round" height="650px">
                <Container maxWidth="lg">
                    <Header />

                    <Box mt={15}>
                        <Typography variant="h1" fontSize="45px" mb={3}>
                            {t('welcome')}
                        </Typography>
                        <Typography variant="h3">{t('welcome_h3')}</Typography>
                        <Box mt={5}>
                            <SearchForm
                                curLang={i18n.language}
                                classNames={{
                                    wrapper: classes.searchWrapper,
                                    doctorSelect: classes.selectDoctorType,
                                    locationInput: classes.inputOfficeLocation,
                                }}
                                searchButton={
                                    <InputAdornment position="end">
                                        <Button
                                            variant="contained"
                                            type="submit"
                                            startIcon={<IconSearch />}
                                            sx={{
                                                background: '#205738',
                                                color: 'white',
                                                borderRadius: 2,
                                                height: '24px',
                                                '&:hover': {
                                                    background: '#205738',
                                                },
                                            }}
                                        >
                                            {t('buttonSearch')}
                                        </Button>
                                    </InputAdornment>
                                }
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Box
                sx={{
                    background: '#9BC1C2',
                    marginBottom: '50px',
                    padding: '50px',
                    boxShadow: '5px 5px 5px #BDBDBD',
                }}
            >
                <Container>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: '300',
                                            backgroundColor: '#4CD48B',
                                            height: '12px',
                                            width: '75px',
                                            margin: 'auto',
                                        }}
                                        variant="h2"
                                        color="black"
                                    >
                                        1000+
                                    </Typography>
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: '350',
                                    }}
                                    mt={3}
                                    variant="h4"
                                    color="black"
                                >
                                    {t('reservationCountInfo')}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: '300',
                                            backgroundColor: '#4CD48B',
                                            height: '12px',
                                            width: '75px',
                                            margin: 'auto',
                                        }}
                                        variant="h2"
                                        color="black"
                                    >
                                        100+
                                    </Typography>
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: '350',
                                    }}
                                    mt={3}
                                    variant="h4"
                                    color="black"
                                >
                                    {t('treatmentModuleCountInfo')}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box
                                sx={{
                                    textAlign: 'center',
                                }}
                            >
                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: '350',
                                            backgroundColor: '#4CD48B',
                                            height: '12px',
                                            width: '75px',
                                            margin: 'auto',
                                        }}
                                        variant="h2"
                                        color="black"
                                    >
                                        855
                                    </Typography>
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: '300',
                                    }}
                                    mt={3}
                                    variant="h4"
                                    color="black"
                                >
                                    {t('succesfullAppointmentsInfo')}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box mt={5} mb={5}>
                <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
                <stripe-pricing-table
                    pricing-table-id="prctbl_1NWfqNFxp2O97KgcqhfFQLo6"
                    publishable-key="pk_live_51NLo3DFxp2O97KgcyH8edFjfc1HheQuKdgneQPMwbShHHhlAp5P3z3Ra1Wgir7h23MqTMkZKESWUBsMUHMmJ1ixx00ZaWWps1V"
                ></stripe-pricing-table>
            </Box>
            <Box>
                <Container>
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: '400',
                                backgroundColor: '#4CD48B',
                                height: '12px',
                                width: '250px',
                            }}
                            mb={10}
                            variant="h2"
                            color="black"
                        >
                            {t('howDoesItWork')}
                        </Typography>
                    </Box>
                </Container>
                <Container>
                    <Timeline
                        sx={{
                            marginBottom: {
                                lg: '150px',
                                xs: '50px',
                            },
                        }}
                        position="alternate"
                    >
                        <TimelineItem>
                            <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right" variant="body2" color="text.secondary">
                                <Image width={300} height={220} src={createAccountPic} alt="" />
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot>{/*<FastfoodIcon />*/}</TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '50px', px: 2 }}>
                                <Typography variant="h3" component="span">
                                    {t('hdiwp1head')}
                                </Typography>
                                <Typography>{t('hdiwp1desc')}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                                <Image width={275} height={250} src={timePic} alt="" />
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color="primary">{/*<LaptopMacIcon />*/}</TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography variant="h3" component="span">
                                    {t('hdiwp2head')}
                                </Typography>
                                <Typography>{t('hdiwp2desc')}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                                <Image width={275} height={250} src={holdingPhonePic} alt="" />
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot color="primary" variant="outlined">
                                    {/*<HotelIcon />*/}
                                </TimelineDot>
                                <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Typography variant="h3" component="span">
                                    {t('hdiwp3head')}
                                </Typography>
                                <Typography>{t('hdiwp3desc')}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </Container>
            </Box>

            <Box
                className="background-round-2"
                sx={{
                    padding: '100px 0 !important',
                }}
            >
                <Container>
                    <Grid container>
                        <Grid item md={6} xs={12}>
                            <Typography variant="h1" my={2}>
                                {t('bookADemo')}
                            </Typography>

                            <Typography component="p" mb={3} color="#000">
                                {t('bookADemoInfo')}
                            </Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Box
                                sx={{
                                    color: 'white',
                                    textAlign: 'right',
                                }}
                            >
                                <Box>
                                    <FormControl className={classes.bookFormControl}>
                                        <InputLabel sx={{ color: '#000' }} htmlFor="my-input">
                                            Email address
                                        </InputLabel>
                                        <Input sx={{ color: '#000' }} id="my-input" aria-describedby="my-helper-text" />
                                        <FormHelperText sx={{ color: '#000' }} id="my-helper-text">
                                            We'll never share your email.
                                        </FormHelperText>
                                    </FormControl>
                                </Box>
                                <Box mt={5}>
                                    <FormControl className={classes.bookFormControl}>
                                        <InputLabel sx={{ color: '#000' }} htmlFor="my-input">
                                            Your full name
                                        </InputLabel>
                                        <Input sx={{ color: 'white' }} id="my-input" aria-describedby="my-helper-text" />
                                    </FormControl>
                                </Box>
                                <Box mt={5}>
                                    <Button variant="contained" sx={{ color: 'white' }}>
                                        {t('buttonSubmit')}
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    )
}

export default HomePage

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    }
}
