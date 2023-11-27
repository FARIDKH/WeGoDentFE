import { Box, DialogContent, Divider, Typography } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import MainLayout from '../../layout/admin/MainLayout'
import type { NextPage } from 'next'
import { Container } from '@mui/material'
import TimestampBox from '../../ui-component/TimestampBox'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import axios from '../../utils/axios'
import PatientChart from '../../ui-component/PatientChart'
import useUser from '../../lib/useUser'
import { format, parseISO } from 'date-fns'
import ClinicSelect from '../../ui-component/Form/selects/ClinicSelect'
import { useQuery } from 'react-query'
import ClinicSelectionModal from '../../modules/clinics/ClinicSelectionModal'
import { Form, Formik } from 'formik'

interface ClinicAppointment {
    appointmentStart: string
    // other properties
}

interface ChartData {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        borderColor: string
        tension: number
    }[]
}

const Dashboard = () => {
    const clinicSelectionRef = useRef(null)
    const [chartData, setChartData] = useState<ChartData>({
        labels: [],
        datasets: [
            {
                label: 'Number of Patients',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    })

    const [clinicId, setClinicId] = useState()

    const { isDoctor, isPatient, isManager, isReceptionist, info, isAdmin } = useUser()

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
              if(clinicId == undefined) return;
                const response = await axios.get<ClinicAppointment[]>(`/api/appointment/clinic/${clinicId}`)
                const appointments = response.data

                // Group and count appointments by day
                const countsByDay: Record<string, number> = {}
                appointments.forEach((appointment) => {
                    const date = format(parseISO(appointment.appointmentStart), 'yyyy-MM-dd')
                    countsByDay[date] = (countsByDay[date] || 0) + 1
                })

                // Convert the counts to chart data
                const labels = Object.keys(countsByDay)
                const data = Object.values(countsByDay)

                setChartData({
                    labels,
                    datasets: [{ ...chartData.datasets[0], data }],
                })
            } catch (error) {
                console.error('Error fetching appointment data:', error)
            }
        }

        fetchAppointments()
    }, [])

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'yyyy-MM-dd',
                    // Display label for every 5 days
                    stepSize: 5,
                },
                title: {
                    display: true,
                    text: 'Date',
                },
                ticks: {
                    // Custom function to only display labels every 5 days
                    callback: function (val, index) {
                        // This assumes your data is sorted. You may need to adjust if it's not.
                        return index % 5 === 0 ? this.getLabelForValue(val) : ''
                    },
                    autoSkip: false, // This is optional to prevent automatic skipping
                },
            },
            y: {
                beginAtZero: true,
                // Set the max value to 5
                max: 5,
                title: {
                    display: true,
                    text: 'Number of Patients',
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    }
    const handleClinicChange = (x) => {
        console.log(x)
    }


        const handleChange = (values) => {
          console.log(values?.clinicId)
      };
      const handleConfirm = (values) => {
        console.log(values?.clinicId)
    };
    return (
        <MainLayout>
            <Typography variant="h3">Welcome Back</Typography>

            <Container
                maxWidth="xs"
                sx={{
                    display: 'flex',
                    height: '300px',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                }}
            >
                <TimestampBox />
            </Container>
            {isManager ||
                (isAdmin && (
                    <Container>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={5} mb={5}>
                            <Typography sx={{ width: '100%' }} variant="h4" component="span">
                                Your monthly report
                            </Typography>
                            <Formik
                                initialValues={{
                                    clinicId: '',
                                }}
                                onSubmit={handleConfirm}
                            >
                                {({ errors, handleBlur, handleChange, touched, values }) => (
                                    <Form>
                                        <DialogContent>
                                            <ClinicSelect
                                                fetch={true}
                                                name="clinicId"
                                                isTouched={!!touched.clinicId}
                                                error={errors?.clinicId as string}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values?.clinicId}
                                            />
                                        </DialogContent>
                                    </Form>
                                )}
                            </Formik>
                        </Box>
                        <Divider style={{ marginTop: '50px', marginBottom: '50px' }} />
                        <div
                            style={{
                                width: '50%',
                                height: '300px',
                            }}
                        >
                            {chartData && <PatientChart data={chartData} options={options} />}
                        </div>
                    </Container>
                ))}
        </MainLayout>
    )
}

export default Dashboard
export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['doctor'])),
        },
    }
}
