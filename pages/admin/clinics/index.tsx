import React, { useRef } from 'react'

import { Box, Typography } from '@material-ui/core'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import MainLayout from '../../../layout/admin/MainLayout'
import MainCard from '../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../ui-component/PaginatedTableGenerator'
import CreateButtonFab from '../../../ui-component/CreateButtonFab'
import ClinicCreateEditForm from '../../../modules/clinics/CreateEdit'

import SubscriptionCreateEditForm from '../../../modules/subscription/CreateEdit'
import DeleteForm from '../../../modules/clinics/Delete'
import { trimString } from '../../../utils/string'
import { ENUM_SUBSCRIPTION_STATUSES } from '../../../modules/subscription/constants'
import Chip from '../../../ui-component/extended/Chip'

import { serverSideTranslations } from "next-i18next/serverSideTranslations";



const Clinics = () => {
    const createEditRef = useRef(null)
    const deleteRef = useRef(null)
    const subCreateEditRef = useRef(null)

    const { data, isFetching, isError, refetch } = useQuery(['Clinics'], async ({ signal }) => {
        const result = await axios(`/api/clinics`, { signal })
        return result.data
    })

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    List of clinics in platfrom
                </Typography>

                <MainCard>
                    <Box px={2}>
                        <PaginatedTableGenerator
                            isLoading={isFetching}
                            isError={isError}
                            data={{
                                data,
                            }}
                            columns={[
                                {
                                    id: 'clinicId',
                                    numeric: false,
                                    label: 'Clinic Id',
                                    align: 'left',
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
                                        const status = isEnabled ? ENUM_SUBSCRIPTION_STATUSES.ACTIVE : ENUM_SUBSCRIPTION_STATUSES.NOTACTIVE;
                                        return (
                                            <Chip label={status} chipcolor={ENUM_SUBSCRIPTION_STATUSES[status]} />
                                        );
                                    },
                                },
                                {
                                    id: 'email',
                                    numeric: false,
                                    label: 'Clinic Email',
                                    align: 'left',
                                },
                                {
                                    id: 'Manager',
                                    numeric: false,
                                    label: 'Manager',
                                    align: 'left',
                                    renderAs: ({ manager }) => (manager?.firstName + " " + manager?.lastName).toString()
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
                                    label: 'Edit',
                                    onClick: (clinic) => createEditRef?.current?.open(clinic),
                                },
                                {
                                    label: 'Delete',
                                    onClick: ({ clinicId }) => {
                                        deleteRef?.current?.open(clinicId)
                                    },
                                },
                                {
                                    label: 'Subscription',
                                    onClick: ({ email }) => {
                                        subCreateEditRef?.current?.open(email)
                                    },
                                },
                            ]}
                        />
                    </Box>
                </MainCard>

                <CreateButtonFab onClick={() => createEditRef?.current?.open()} />

                <SubscriptionCreateEditForm ref={subCreateEditRef} onSuccess={refetch} />
                <ClinicCreateEditForm ref={createEditRef} onSuccess={refetch} />
                <DeleteForm ref={deleteRef} onSuccess={refetch} />
                
            </MainLayout>
        </>
    )
}

export default Clinics

export const getStaticProps = async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["users"])),
      },
    };
  };