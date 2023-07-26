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
import UpdateAvailability from '../../../modules/appointments/UpdateAvailability'
import CreateButtonFab from '../../../ui-component/CreateButtonFab'
import dayjs from 'dayjs'

import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Availabilities = () => {
    const [isListView, setIsListView] = useState(false)
    const createEditRef = useRef(null)

    const { isDoctor, isPatient, info } = useUser()
    const id = info?.id
    const router: any = useRouter()

    const { data, isFetching, isError, refetch } = useQuery(
        ['Availabilities', router.query],
        async ({ signal }) => {
            const result = await axios(`/api/doctor/${id}/availability`, { signal })
            return result.data
        },
        {
            initialData: [],
            enabled: !!id,
        }
    )

    const events = data?.map(({ id, ...item }) => {
        return {
            start: dayjs(item?.startDateTime).format("YYYY-DD-MM"),
            end: dayjs(item?.endDateTime).format("YYYY-DD-MM"),
            // backgroundColor: APPOINTMENT_STATUS_BGCOLORS?.[item?.status],
            display:"background",
            color:"red",
            overlap: true
        }
    })


   

    
    
    const canEdit = (status) => {
        return isPatient ? [ENUM_APPOINTMENT_STATUSES.REQUESTED].includes(status) : true
    }


    

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    Availabilities
                </Typography>

                <MainCard>
                    <Box className="fullCalendar" px={2}>
                        
                        <div>
                            <FullCalendar
                                events={events}
                                buttonText={{
                                    month: 'Month',
                                }}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                headerToolbar={{
                                    left: 'prev,next',
                                    center: 'title',
                                    right: 'dayGridMonth',
                                }}
                                initialView="dayGridMonth"
                                editable={true}
                                selectable={true}
                                selectMirror={true}
                                dayMaxEvents={true}
                                select={({ startStr, endStr }) => {
                                    createEditRef?.current?.open({
                                        timeSlotStart: startStr,
                                        timeSlotEnd: endStr,
                                    })
                                }}
                                eventClick={({ event }) => {
                                    const appointment = event?.extendedProps
                                    const editable = canEdit(appointment?.status)
                                    editable && createEditRef?.current?.open(appointment)
                                }}
                            />
                            </div>
                        
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

                <UpdateAvailability ref={createEditRef} onSuccess={refetch} />

                <CreateButtonFab onClick={() => createEditRef?.current?.open()} />
            </MainLayout>
        </>
    )
}

export default Availabilities

export const getStaticProps = async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["doctor"])),
      },
    };
  };