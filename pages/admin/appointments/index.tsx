/* eslint-disable react/display-name */
import React, { useRef, useState } from 'react'

import { useRouter } from 'next/router'
import MainLayout from '../../../layout/admin/MainLayout'
import MainCard from '../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../ui-component/PaginatedTableGenerator'
import { Box, Button, Typography } from '@material-ui/core'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import useUser from '../../../lib/useUser'
import { IconList } from '@tabler/icons'
import DateTime from '../../../ui-component/DateTime'
import Chip from '../../../ui-component/extended/Chip'
import { APPOINTMENT_STATUS_BGCOLORS, APPOINTMENT_STATUS_COLORS, ENUM_APPOINTMENT_STATUSES } from '../../../modules/appointments/constants'
import CreateEditForm from '../../../modules/appointments/CreateEdit'
import CreateButtonFab from '../../../ui-component/CreateButtonFab'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Appointments = () => {
    const [isListView, setIsListView] = useState(false)
    const createEditRef = useRef(null)

    const { isDoctor, isPatient, isManager, isReceptionist, info } = useUser()
    const id = info?.id
    const router: any = useRouter()

    const { t } = useTranslation('doctor')

    const { data: clinicsData,  isSuccess: clinicsFetched } = useQuery(
        'Clinics',
        async ({ signal }) => {
            const result = await axios(`/api/clinics/all`, { signal });
            return result.data;
        },
        {
            initialData: [],
            enabled: isManager
        }
    );
    

   
    const { data , isFetching, isError, refetch } = useQuery(
        ['Appointments', router.query],
        async ({ signal }) => {
            if (isDoctor) {
                const result = await axios(`/api/doctor/${id}/appointments`, { signal });
                return result.data.filter(item => item.status !== ENUM_APPOINTMENT_STATUSES.REJECTED);
            }
    
            if (isPatient) {
                const result = await axios(`/api/patient/${id}/appointments`, { signal });
                return result.data.filter(item => item.status !== ENUM_APPOINTMENT_STATUSES.REJECTED);
            }
    
            if (isManager && clinicsFetched) {
                const appointmentsPromises = clinicsData.map(clinic => 
                    axios(`/api/appointment/clinic/${clinic.clinicId}`, { signal })
                );
                console.log(appointmentsPromises)
                const allAppointmentsResults = await Promise.all(appointmentsPromises);
                
                return allAppointmentsResults.flatMap(result => 
                    result.data.filter(item => item.status !== ENUM_APPOINTMENT_STATUSES.REJECTED)
                );
            }

            if (isReceptionist) {
                const receptionistId = id; // Assuming id is already defined in the scope.
            
                try {
                    // Fetch clinics associated with the receptionist.
                    const response = await axios(`/api/clinics/receptionist/${receptionistId}`, { signal });
            
                    const receptionistClinic = response?.data; // Assuming the API returns the list of clinics in the response's data field.
            
                    const appointmentsPromises = receptionistClinic.map(clinic => 
                        axios(`/api/appointment/clinic/${clinic?.clinicId}`, { signal })
                    );
                    
                    
                    const allAppointmentsResults = await Promise.all(appointmentsPromises);
                    
                    return allAppointmentsResults.flatMap(result => 
                        result.data.filter(item => item.status !== ENUM_APPOINTMENT_STATUSES.REJECTED)
                    );
                } catch (error) {
                    console.error("Error fetching clinics or appointments:", error);
                    // Handle error appropriately, for example, you might want to return an empty list or throw the error.
                    return [];
                }
            }
            
        },
        {
            initialData: [],
            enabled: isDoctor || isPatient || clinicsFetched  // Adjust this based on when you want the query to run
        }
    );
    
    
    
    

    const events = data?.map(({ id, ...item }) => {
        const user = isDoctor ? item?.patientDTO?.userDTO : item?.doctorDTO?.userDTO
        // console.log(item?.treatmentSessionDTO?.treatmentPhaseDTO?.name)

        let title = `${user?.firstName} ${user?.lastName}`;
    
        // Add clinic info if available.
        if(item?.clinicDTO) {
            title += ` | Clinic: ${item.clinicDTO.name}`;
        }


        if (item?.status === ENUM_APPOINTMENT_STATUSES.REJECTED) return []
        return {
            id,
            title: `${user?.firstName} ${user?.lastName}`,
            start: item?.appointmentStart,
            end: item?.appointmentEnd,
            backgroundColor: APPOINTMENT_STATUS_BGCOLORS?.[item?.status],
            patientDTO: item?.patientDTO,
            clinicDTO: item?.clinicDTO,
            extendedProps: {
                id,
                ...item,
            },
        }
    })

    const canEdit = (status) => {
        return isPatient ? [ENUM_APPOINTMENT_STATUSES.REQUESTED].includes(status) : true
    }

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    {t('labelAppointments')}
                </Typography>

                <MainCard>
                    <Box className="fullCalendar">
                        <Box display={'flex'} justifyContent="flex-end" mb={2}>
                            <Button
                                onClick={() => setIsListView((prev) => !prev)}
                                size="small"
                                variant="contained"
                                color={isListView ? 'secondary' : 'primary'}
                            >
                                <IconList size={24} />
                            </Button>
                        </Box>

                        {isListView ? (
                            <PaginatedTableGenerator
                                isLoading={isFetching}
                                isError={isError}
                                data={{
                                    data,
                                }}
                                columns={[
                                    {
                                        id: 'patientName',
                                        numeric: false,
                                        label: t('labelPatients'),
                                        align: 'left',
                                        hide: isPatient,
                                        renderAs: ({ patientDTO }) => `${patientDTO?.userDTO?.firstName} ${patientDTO?.userDTO?.lastName}`,
                                    },
                                    {
                                        id: 'patientContact',
                                        numeric: false,
                                        label: t('labelPatientContact'),
                                        align: 'left',
                                        hide: isPatient,
                                        renderAs: ({ patientDTO }) => (
                                            <Box>
                                                <Box>
                                                    <b>Phone Number:</b> {patientDTO?.userDTO?.phoneNumber}
                                                </Box>
                                                <Box>
                                                    <b>Email:</b> {patientDTO?.userDTO?.email}
                                                </Box>
                                            </Box>
                                        ),
                                    },
                                    {
                                        id: 'clinicName',
                                        numeric: false,
                                        label: 'Clinic Name',
                                        align: 'left',
                                        renderAs: ({ clinicDTO }) => clinicDTO?.name,
                                        hide: !isManager // or any condition you see fit
                                    },
                                    {
                                        id: 'clinicLocation',
                                        numeric: false,
                                        label: 'Clinic Location',
                                        align: 'left',
                                        renderAs: ({ clinicDTO }) => clinicDTO?.officeLocationName,
                                        hide: !isManager
                                    },  
                                    // ... other columns
                                    
                                    {
                                        id: 'doctor',
                                        numeric: false,
                                        label: 'Doctor',
                                        align: 'left',
                                        hide: isDoctor,
                                        renderAs: ({ doctorDTO }) => {
                                            // Destructure properties
                                            const { userDTO } = doctorDTO || {};
                                            const { firstName, lastName } = userDTO || {};
                                    
                                            // Check if both are defined and return formatted name or '-'
                                            return (firstName && lastName) ? `${firstName} ${lastName}` : '-';
                                        },
                                    },
                                    
                                    {
                                        id: 'doctorContact',
                                        numeric: false,
                                        label: 'Doctor Contact',
                                        align: 'left',
                                        hide: !!isReceptionist || !!isManager || !!isDoctor ,
                                        renderAs: ({ doctorDTO }) => {
                                            if (!doctorDTO) {
                                                return '-';
                                            }
                                    
                                            return (
                                                <Box>
                                                    <Box>
                                                        <b>Address:</b> {doctorDTO?.officeLocationName || '-'}
                                                    </Box>
                                                    <Box>
                                                        <b>Phone Number:</b> {doctorDTO?.userDTO?.phoneNumber || '-'}
                                                    </Box>
                                                    <Box>
                                                        <b>Email:</b> {doctorDTO?.userDTO?.email || '-'}
                                                    </Box>
                                                </Box>
                                            );
                                        },
                                    },

                                    
                                    {
                                        id: 'appointmentStart',
                                        numeric: false,
                                        label: t('labelAppointmentStartDate'),
                                        align: 'left',
                                        renderAs: ({ appointmentStart }) => <DateTime value={appointmentStart} />,
                                    },
                                    {
                                        id: 'clinic',
                                        numeric: false,
                                        label: "Clinic",
                                        align: 'left',
                                        renderAs: ({ clinicDTO }) => clinicDTO?.name,
                                    },
                                    {
                                        id: 'appointmentEnd',
                                        numeric: false,
                                        label: t('labelAppointmentEndDate'),
                                        align: 'left',
                                        renderAs: ({ appointmentEnd }) => <DateTime value={appointmentEnd} />,
                                    },
                                    {
                                        id: 'status',
                                        numeric: false,
                                        label: t('labelAppointmentStatus'),
                                        align: 'left',
                                        renderAs: ({ status }) => <Chip label={status} chipcolor={APPOINTMENT_STATUS_COLORS?.[status]} />,
                                    },
                                    {
                                        id: 'Treatment',
                                        numeric: false,
                                        label: 'Treatment',
                                        align: 'left',
                                        renderAs: ({ treatmentSessionDTO }) => (
                                            <Chip label={treatmentSessionDTO?.treatmentPhaseDTO?.name ?? null} />
                                        ),
                                    },
                                ]}
                                actions={(appointment) => [
                                    {
                                        label: 'Edit',
                                        onClick: () => createEditRef?.current?.open(appointment),
                                        hide: !canEdit(appointment?.status),
                                    },
                                ]}
                            />
                        ) : (
                            <Box
                                sx={{
                                    '& .fc-header-toolbar': {
                                        flexWrap: 'wrap',
                                        gap: '10px',
                                    },
                                }}
                            >
                                <FullCalendar
                                    events={events}
                                    buttonText={{
                                        today: t('labelToday'),
                                        month: t('labelMonth'),
                                        week: t('labelWeek'),
                                        day: t('labelDay'),
                                    }}
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                                    }}
                                    initialView="timeGridDay"
                                    editable={true}
                                    selectable={true}
                                    selectMirror={true}
                                    dayMaxEvents={true}
                                    select={({ startStr, endStr }) => {
                                        createEditRef?.current?.open({
                                            appointmentStart: startStr,
                                            appointmentEnd: endStr,
                                        })
                                    }}
                                    eventClick={({ event }) => {
                                        const appointment = event?.extendedProps
                                        const editable = canEdit(appointment?.status)
                                        editable && createEditRef?.current?.open(appointment)
                                    }}
                                />
                            </Box>
                        )}
                        {/*<StyledMenu
                            id="customized-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                          >
                            <StyledMenuItem>
                              <ListItemIcon>
                                <SendIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Sent mail" />
                            </StyledMenuItem>
                            <StyledMenuItem>
                              <ListItemIcon>
                                <DraftsIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Drafts" />
                            </StyledMenuItem>
                            <StyledMenuItem>
                              <ListItemIcon>
                                <InboxIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Inbox" />
                            </StyledMenuItem>
                        </StyledMenu>*/}
                    </Box>
                </MainCard>

                <CreateEditForm ref={createEditRef} onSuccess={refetch} />

                <CreateButtonFab onClick={() => createEditRef?.current?.open()} />
            </MainLayout>
        </>
    )
}

export default Appointments

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['doctor'])),
        },
    }
}
