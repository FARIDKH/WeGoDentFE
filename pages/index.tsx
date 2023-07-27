import { Box, Button, Container, InputAdornment, makeStyles, TextField, Typography, Grid } from '@material-ui/core'
import Logo from '../ui-component/Logo'
import { ENUM_DOCTOR_TYPES } from '../hooks/useDoctors'
import { Formik } from 'formik'
import IconSelect from '@material-ui/icons/ExpandMore'
import IconSearch from '@material-ui/icons/Search'
import Layout from '../layout/main/Layout'
import { useRouter } from 'next/router'
import LoginButton from '../layout/main/LoginButton'
import DoctorTypeSelect from '../ui-component/main/DoctorTypeSelect'

import Image from 'next/image'

import timePic from '../public/time-1.png'
import createAccountPic from '../public/create-account-form-1.png'
import holdingPhonePic from '../public/holding-phone-colour-1.png'


import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { FormControl, InputLabel, FormHelperText, Input } from '@mui/material';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from 'next-i18next'

import {
    IconFlagTR,
    IconFlagUK,
} from 'material-ui-flags';

  
 

const useStyle = makeStyles(() => ({
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
    },
}))

declare global {
      namespace JSX {
        interface IntrinsicElements {
          'stripe-pricing-table': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
      }
    }

const HomePage = () => {
    const classes = useStyle()
    const router = useRouter()

    const { t, i18n } = useTranslation('common');



    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng).then(() => {
            console.log(`Language changed to ${lng}`);
          });
    };
    
    const [language, setLanguage] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value as string);
        changeLanguage(event.target.value as string);
    };

    return (
        <Layout>
            <Box className="background-round" height="650px">
                <Container maxWidth="lg">
                    <Box display="flex" justifyContent="space-between" pt={4}>
                        <Logo />
                        <Box style={{ display: 'inline-flex' }} >
                            
                            <Box mr={5} sx={{ minWidth: 100 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Language</InputLabel>
                                    <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Language"
                                    value={language}
                                    onChange={handleChange}
                                    defaultValue={'en'}
                                    >
                                        <MenuItem value={'en'}><IconFlagUK sx={{ "marginRight" : "15px" }} /> EN </MenuItem>
                                        <MenuItem value={'hu'}><svg style={{ "marginRight" : "15px" }}  width={'25px'} xmlns="http://www.w3.org/2000/svg" id="flag-icons-hu" viewBox="0 0 640 480"> <g fill-rule="evenodd"> <path fill="#fff" d="M640 480H0V0h640z"/> <path fill="#388d00" d="M640 480H0V320h640z"/> <path fill="#d43516" d="M640 160.1H0V.1h640z"/> </g> </svg> HU</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <LoginButton />
                        </Box>
                        
                    </Box>

                    <Box mt={15}>
                        <Typography variant="h1" fontSize="45px" mb={3}>
                            {t('welcome')}
                        </Typography>
                        <Typography variant="h3" color="#808080">
                            {t('welcome_h3')}
                        </Typography>
                        <Box mt={5}>
                            <Formik
                                initialValues={{
                                    doctorType: ENUM_DOCTOR_TYPES.General_Dentist,
                                    officeLocation: '',
                                }}
                                onSubmit={(values) => {
                                    if (values?.doctorType && values?.officeLocation)
                                        router.push({
                                            pathname: '/doctors',
                                            query: values,
                                        })
                                }}
                            >
                                {({ handleSubmit, values, handleChange }) => (
                                    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                        <Box sx={{ border: '1px solid white', borderRadius: '50px', boxShadow: 4, width: '73%' }}

                                        >
                                            <DoctorTypeSelect
                                                className={classes.selectDoctorType}
                                                name="doctorType"
                                                value={values?.doctorType}
                                                variant="outlined"
                                                IconComponent={() => <IconSelect />}
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
                                                            <Button
                                                                onClick={() => handleSubmit()}
                                                                variant="contained"
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
                                                    ),
                                                }}
                                            />
                                        </Box>
                                    </form>
                                )}
                            </Formik>
                        </Box>
                    </Box>
                </Container>
            </Box>
                <Box sx={{ 

                    background :'#9BC1C2',
                    marginBottom :'50px',
                    padding : '50px',
                    boxShadow: '5px 5px 5px #BDBDBD'
                }}>

                    <Container>
                        <Grid  container spacing={2}>
                            <Grid item xs={4}>
                                
                                <Box sx={{
                                    textAlign : 'center'
                                }}>
                                    <Box >
                                        <Typography sx={{
                                    fontWeight : '300',
                                    backgroundColor: "#4CD48B",
                                    height:'12px',
                                    width:"75px",
                                    margin:"auto",
                                }}  variant="h2" color="black">
                                                1000+
                                        </Typography>
                                    </Box>
                                    <Typography sx={{
                                    fontWeight : '350'
                                }} mt={3}  variant="h4" color="black">

                                            {t('reservationCountInfo')}

                                    </Typography>
                                </Box>

                            </Grid>
                            <Grid item xs={4}>
                                
                                <Box sx={{
                                    textAlign : 'center'
                                }}>
                                    <Box >
                                        <Typography sx={{
                                    fontWeight : '300',
                                    backgroundColor: "#4CD48B",
                                    height:'12px',
                                    width:"75px",
                                    margin:"auto",
                                }}  variant="h2" color="black">
                                                100+
                                        </Typography>
                                    </Box>
                                    <Typography sx={{
                                    fontWeight : '350'
                                }} mt={3}  variant="h4" color="black">

                                        {t('treatmentModuleCountInfo')}

                                    </Typography>
                                </Box>

                            </Grid>
                            <Grid item xs={4}>
                                
                                <Box sx={{
                                    textAlign : 'center'
                                }}>
                                    <Box >
                                        <Typography sx={{
                                    fontWeight : '350',
                                    backgroundColor: "#4CD48B",
                                    height:'12px',
                                    width:"75px",
                                    margin:"auto",
                                }}  variant="h2" color="black">
                                                855
                                        </Typography>
                                    </Box>
                                    <Typography sx={{
                                    fontWeight : '300'
                                }} mt={3}  variant="h4" color="black">

                                        {t('succesfullAppointmentsInfo')}     

                                    </Typography>
                                </Box>

                            </Grid>
                        </Grid>
                    </Container>
                </Box>

            <Box mt={5} mb={5}> 
                <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
                <stripe-pricing-table pricing-table-id="prctbl_1NWfqNFxp2O97KgcqhfFQLo6"
                publishable-key="pk_live_51NLo3DFxp2O97KgcyH8edFjfc1HheQuKdgneQPMwbShHHhlAp5P3z3Ra1Wgir7h23MqTMkZKESWUBsMUHMmJ1ixx00ZaWWps1V">
                </stripe-pricing-table>
            </Box>
            <Box>
                <Container>
                    
                   <Box>
                        <Typography sx={{
                                fontWeight : '400',
                                backgroundColor: "#4CD48B",
                                height:'12px',
                                width:"250px",
                            }}  mb={10} variant="h2" color="black"> 
                                    {t('howDoesItWork')}     
                                    </Typography>

                   </Box>
                </Container>
                <Container>

                    

                    <Timeline sx={{ marginBottom : "150px"}} position="alternate">
                      <TimelineItem>
                        <TimelineOppositeContent
                          sx={{ m: 'auto 0' }}
                          align="right"
                          variant="body2"
                          color="text.secondary"
                        >
                            <Image width={300}
                      height={220} src={createAccountPic} />
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineConnector />
                          <TimelineDot>
                            {/*<FastfoodIcon />*/}
                          </TimelineDot>
                          <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '50px', px: 2 }}>
                          <Typography variant="h3" component="span">
                          {t('hdiwp1head')}
                          </Typography>
                          <Typography>
                            
                          {t('hdiwp1desc')}     

                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                      <TimelineItem>
                        <TimelineOppositeContent
                          sx={{ m: 'auto 0' }}
                          variant="body2"
                          color="text.secondary"
                        >
                          <Image width={275}
                      height={250} src={timePic} />
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                          <TimelineConnector />
                          <TimelineDot color="primary">
                            {/*<LaptopMacIcon />*/}
                          </TimelineDot>
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
                      <TimelineOppositeContent
                          sx={{ m: 'auto 0' }}
                          variant="body2"
                          color="text.secondary"
                        >
                          <Image width={275}
                      height={250} src={holdingPhonePic} />
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


            <Box className="background-round-2" >
                <Container>
                    <Grid container>
                        <Grid item xs={6}>
                            
                            <h1>{t('bookADemo')}     </h1>
                            <p>{t('bookADemoInfo')}  </p>
                        </Grid> 
                        <Grid item xs={6}>
                            <Box sx={{
                                "color" : "white",
                                "padding" : "25px",
                                "textAlign" : "right",
                            }
                            }>
                                <Box>
                                    <FormControl >
                                      <InputLabel sx={{ 
                                "fontSize" : "20px",
                                'color':'white',
                                'width' : "250px"
                            }} htmlFor="my-input">Email address</InputLabel>
                                      <Input id="my-input" aria-describedby="my-helper-text" />
                                      <FormHelperText sx={{ 'color':'white' }} id="my-helper-text">We'll never share your email.</FormHelperText>
                                    </FormControl>
                                </Box>
                                <Box mt={5}>

                                    <FormControl >
                                      <InputLabel sx={{ 'color':'white' }} htmlFor="my-input">Your full name</InputLabel>
                                      <Input sx={{ 'color':'white' }} id="my-input" aria-describedby="my-helper-text" />
                                    </FormControl>
                                </Box>
                                <Box mt={5}>
                                    <Button variant="contained" sx={{"color": "white"}}>{t('buttonSubmit')}</Button>  
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
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  };