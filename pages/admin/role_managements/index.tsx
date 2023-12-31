import React, { useRef } from 'react'

import { Box, Typography } from '@material-ui/core'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import MainLayout from '../../../layout/admin/MainLayout'
import MainCard from '../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../ui-component/PaginatedTableGenerator'
import CreateButtonFab from '../../../ui-component/CreateButtonFab'
import CreateEditForm from '../../../modules/role_managements/CreateEdit'
import DeleteForm from '../../../modules/Doctor/Delete'
import { trimString } from '../../../utils/string'

import { serverSideTranslations } from "next-i18next/serverSideTranslations";



const RoleManagements = () => {
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
                                    id: 'Role',
                                    numeric: false,
                                    label: 'Type',
                                    align: 'left',
                                    renderAs: ({ groupRoleResponseDTOS }) => (
                                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                            {groupRoleResponseDTOS?.map((role, index) => (
                                                <li key={index} style={{ padding: '2px 0' }}>
                                                    {role.code}
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                },
                            ]}
                            actions={[
                                {
                                    label: 'Edit',
                                    onClick: (user) => createEditRef?.current?.open(user),
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

export default RoleManagements

export const getStaticProps = async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["doctor"])),
      },
    };
  };