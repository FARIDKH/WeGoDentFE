import React, { useRef } from 'react'

import { Box, Typography } from '@material-ui/core'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import MainLayout from '../../../layout/admin/MainLayout'
import MainCard from '../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../ui-component/PaginatedTableGenerator'
import CreateButtonFab from '../../../ui-component/CreateButtonFab'
import CreateEditForm from '../../../modules/manager/CreateEdit'
import DeleteForm from '../../../modules/Doctor/Delete'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Users = () => {
    const createEditRef = useRef(null)
    const deleteRef = useRef(null)

    const { data, isFetching, isError, refetch } = useQuery(['Users'], async ({ signal }) => {
        const result = await axios(`/api/allUsers`, { signal })
        return result.data.data
    })

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    List of users in platfrom
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
                                    id: 'id',
                                    numeric: false,
                                    label: 'ID',
                                    align: 'left',
                                },
                                {
                                    id: 'username',
                                    numeric: false,
                                    label: 'User',
                                    align: 'left',
                                    // renderAs: ({ userDTO }) => ("Dr. " + data.firstName + " " + data.lastName).toString()
                                },
                                {
                                    id: 'Type',
                                    numeric: false,
                                    label: 'Type',
                                    align: 'left',
                                    renderAs: ({ groupRoleResponseDTOS }) => groupRoleResponseDTOS?.[0]?.code,
                                },
                            ]}
                            actions={[
                                {
                                    label: 'Edit',
                                    onClick: (doctor) => createEditRef?.current?.open(doctor),
                                },
                                {
                                    label: 'Delete',
                                    onClick: ({ id }) => {
                                        deleteRef?.current?.open(id)
                                    },
                                },
                            ]}
                        />
                    </Box>
                </MainCard>

                <CreateButtonFab onClick={() => createEditRef?.current?.open()} />

                <CreateEditForm ref={createEditRef} onSuccess={refetch} />
                <DeleteForm ref={deleteRef} onSuccess={refetch} />
            </MainLayout>
        </>
    )
}

export default Users

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['doctor'])),
        },
    }
}
