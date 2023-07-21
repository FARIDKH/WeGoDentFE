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


const Appointments = () => {
    const [isListView, setIsListView] = useState(false)
    const createEditRef = useRef(null)

    const { isDoctor, isPatient, info } = useUser()
    const id = info?.id
    const router: any = useRouter()

    const { data, isFetching, isError, refetch } = useQuery(
        ['Appointments', router.query],
        async ({ signal }) => {
            const result = await axios(isDoctor ? `/api/doctor/${id}/appointments` : `/api/patient/${id}/appointments`, { signal })
            return result.data
        },
        {
            initialData: [],
            enabled: !!id,
        }
    )

    const events = data?.map(({ id, ...item }) => {
        const user = isDoctor ? item?.patientDTO?.userDTO : item?.doctorDTO?.userDTO

        return {
            id,
            title: `${user?.firstName} ${user?.lastName}`,
            start: item?.appointmentStart,
            end: item?.appointmentEnd,
            backgroundColor: APPOINTMENT_STATUS_BGCOLORS?.[item?.status],
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
                    Appointments
                </Typography>

                <MainCard>
                    <Box className="fullCalendar" px={2}>
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
                                        id: 'patient',
                                        numeric: false,
                                        label: 'Patient',
                                        align: 'left',
                                        hide: isPatient,
                                        renderAs: ({ patientDTO }) => `${patientDTO?.userDTO?.firstName} ${patientDTO?.userDTO?.lastName}`,
                                    },
                                    {
                                        id: 'patient',
                                        numeric: false,
                                        label: 'Patient Contact',
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
                                        id: 'doctor',
                                        numeric: false,
                                        label: 'Doctor',
                                        align: 'left',
                                        hide: isDoctor,
                                        renderAs: ({ doctorDTO }) => `${doctorDTO?.userDTO?.firstName} ${doctorDTO?.userDTO?.lastName}`,
                                    },
                                    {
                                        id: 'doctorType',
                                        numeric: false,
                                        label: 'Doctor Type',
                                        align: 'left',
                                        hide: isDoctor,
                                        renderAs: ({ doctorDTO }) => doctorDTO?.doctorType?.replaceAll('_', ' '),
                                    },
                                    {
                                        id: 'doctorContact',
                                        numeric: false,
                                        label: 'Doctor Contact',
                                        align: 'left',
                                        hide: isDoctor,
                                        renderAs: ({ doctorDTO }) => (
                                            <Box>
                                                <Box>
                                                    <b>Address:</b> {doctorDTO?.officeLocationName}
                                                </Box>
                                                <Box>
                                                    <b>Phone Number:</b> {doctorDTO?.userDTO?.phoneNumber}
                                                </Box>
                                                <Box>
                                                    <b>Email:</b> {doctorDTO?.userDTO?.email}
                                                </Box>
                                            </Box>
                                        ),
                                    },
                                    {
                                        id: 'appointmentStart',
                                        numeric: false,
                                        label: 'Start Date',
                                        align: 'left',
                                        renderAs: ({ appointmentStart }) => <DateTime value={appointmentStart} />,
                                    },
                                    {
                                        id: 'appointmentEnd',
                                        numeric: false,
                                        label: 'End Date',
                                        align: 'left',
                                        renderAs: ({ appointmentEnd }) => <DateTime value={appointmentEnd} />,
                                    },
                                    {
                                        id: 'status',
                                        numeric: false,
                                        label: 'Status',
                                        align: 'left',
                                        renderAs: ({ status }) => <Chip label={status} chipcolor={APPOINTMENT_STATUS_COLORS?.[status]} />,
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
                        <div>
                            <FullCalendar
                                events={events}
                                buttonText={{
                                    today: 'Today',
                                    month: 'Month',
                                    week: 'Week',
                                    day: 'Day',
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
                            </div>
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
