import React, { useRef } from 'react'

import { Box, Typography } from '@material-ui/core'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import MainLayout from '../../../layout/admin/MainLayout'
import MainCard from '../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../ui-component/PaginatedTableGenerator'
import CreateButtonFab from '../../../ui-component/CreateButtonFab'
import ClinicCreateEditForm from '../../../modules/clinics/CreateEdit'
import AddDoctorForm from '../../../modules/clinics/AddDoctor'
import BillingCreateEditForm from '../../../modules/clinics/billing-details/CreateEdit'

import CreateEditPictureForm from '../../../modules/clinics/CreateEditPicture'
import SubscriptionCreateEditForm from '../../../modules/subscription/CreateEdit'
import DeleteForm from '../../../modules/clinics/Delete'
import { ENUM_SUBSCRIPTION_STATUSES } from '../../../modules/subscription/constants'
import Chip from '../../../ui-component/extended/Chip'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ClinicPicture from '../../../modules/clinics/ClinicPicture'

const Clinics = () => {
    const createEditRef = useRef(null)
    const deleteRef = useRef(null)
    const subCreateEditRef = useRef(null)
    const billingCreateEditRef = useRef(null)
    const addDoctorRef = useRef(null)
    const addPictureRef = useRef(null)

    const [filter, setFilter] = React.useState('')

    const { data, isFetching, isError, refetch } = useQuery(['Clinics'], async ({ signal }) => {
        const result = await axios(`/api/clinics/all`, { signal })
        return result.data
    })

    const allDoctorTypes = data ? data.flatMap((clinic) => clinic.doctorTypes ?? []) : []

    const distinctDoctorTypes = [...new Set(allDoctorTypes)]

    const filteredData = filter ? data?.filter((clinic) => clinic?.doctorTypes?.includes(filter)) : data

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    List of clinics in platfrom
                </Typography>
                <Autocomplete
                    options={distinctDoctorTypes}
                    value={filter}
                    onChange={(event, value) => {
                        if (typeof value === 'string') {
                            setFilter(value)
                        }
                        // if value can be an array and you want to extract a string from it
                        // else if (Array.isArray(value) && value.length > 0) {
                        //     setFilter(value[0]); // or some other logic to get the string
                        // }
                    }}
                    freeSolo
                    renderInput={(params) => <TextField {...params} label="Filter by Doctor Type" variant="outlined" margin="normal" />}
                />

                <MainCard>
                    <Box px={2}>
                        <PaginatedTableGenerator
                            isLoading={isFetching}
                            isError={isError}
                            data={{ data: filteredData }}
                            columns={[
                                {
                                    id: 'Image',
                                    numeric: false,
                                    label: 'image',
                                    align: 'left',
                                    renderAs: (clinic) => {
                                        return (
                                            <ClinicPicture clinic={clinic} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                        )
                                    },
                                },
                                {
                                    id: 'name',
                                    numeric: false,
                                    label: 'Name',
                                    align: 'left',
                                },
                                {
                                    id: 'officeLocationName',
                                    numeric: false,
                                    label: 'Office Location',
                                    align: 'left',
                                },
                                {
                                    id: 'isEnabled',
                                    numeric: false,
                                    label: 'Subscription status',
                                    align: 'left',
                                    // renderAs: ({ groupRoleResponseDTOS }) => (groupRoleResponseDTOS?.[0]?.code)
                                    renderAs: ({ isEnabled }) => {
                                        const status = isEnabled ? ENUM_SUBSCRIPTION_STATUSES.ACTIVE : ENUM_SUBSCRIPTION_STATUSES.NOTACTIVE
                                        return <Chip label={status} chipcolor={ENUM_SUBSCRIPTION_STATUSES[status]} />
                                    },
                                },
                                {
                                    id: 'email',
                                    numeric: false,
                                    label: 'Clinic Email',
                                    align: 'left',
                                },
                                {
                                    id: 'managers',
                                    numeric: false,
                                    label: 'Managers',
                                    align: 'left',
                                    renderAs: ({ managers }) => {
                                        if (managers && managers.length > 0) {
                                            return managers.map((manager) => `${manager?.firstName} ${manager?.lastName}`).join(' • ')
                                        }
                                        return 'N/A'
                                    },
                                },
                                {
                                    id: 'doctorQuota',
                                    numeric: false,
                                    label: 'Doctor Quota',
                                    align: 'left',
                                },
                                {
                                    id: 'currentDoctorCount',
                                    numeric: false,
                                    label: 'Current Doctor Count',
                                    align: 'left',
                                },
                            ]}
                            actions={[
                                {
                                    label: 'Basic informations',
                                    onClick: (clinic) => createEditRef?.current?.open(clinic),
                                },
                                {
                                    label: 'Profile picture',
                                    onClick: (clinic) => addPictureRef?.current?.open(clinic),
                                },
                                {
                                    label: 'Billing details',
                                    onClick: (clinic) => billingCreateEditRef?.current?.open(clinic),
                                },
                                {
                                    label: 'Subscription',
                                    onClick: (clinic) => {
                                        subCreateEditRef?.current?.open(clinic?.clinicId)
                                    },
                                },
                                {
                                    label: 'Doctors of clinic',
                                    onClick: (clinic) => addDoctorRef?.current?.open(clinic),
                                },
                            ]}
                        />
                    </Box>
                </MainCard>

                <CreateButtonFab onClick={() => createEditRef?.current?.open()} />

                <SubscriptionCreateEditForm ref={subCreateEditRef} onSuccess={refetch} />
                <ClinicCreateEditForm ref={createEditRef} onSuccess={refetch} />
                <BillingCreateEditForm ref={billingCreateEditRef} onSuccess={refetch} />
                <AddDoctorForm ref={addDoctorRef} onSuccess={refetch} />
                <CreateEditPictureForm ref={addPictureRef} onSuccess={refetch} />

                <DeleteForm ref={deleteRef} onSuccess={refetch} />
            </MainLayout>
        </>
    )
}

export default Clinics

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['doctor'])),
        },
    }
}
