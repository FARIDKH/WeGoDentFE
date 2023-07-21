import React from 'react'

import MainLayout from '../../../layout/admin/MainLayout'
import MainCard from '../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../ui-component/PaginatedTableGenerator'
import { Box, Typography } from '@material-ui/core'
import { useDoctorPatients } from '../../../hooks/usePatient'

const Patients = () => {
    const { data, isFetching, isError } = useDoctorPatients()

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    Patients
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
                                    id: 'firstName',
                                    numeric: false,
                                    label: 'First Name',
                                    align: 'left',
                                    renderAs: ({ userDTO }) => userDTO?.firstName,
                                },
                                {
                                    id: 'lastName',
                                    numeric: false,
                                    label: 'Last Name',
                                    align: 'left',
                                    renderAs: ({ userDTO }) => userDTO?.lastName,
                                },
                                {
                                    id: 'email',
                                    numeric: false,
                                    label: 'Email',
                                    align: 'left',
                                    renderAs: ({ userDTO }) => userDTO?.email,
                                },
                                {
                                    id: 'phoneNumber',
                                    numeric: false,
                                    label: 'Phone Number',
                                    align: 'left',
                                    renderAs: ({ userDTO }) => userDTO?.phoneNumber,
                                },
                            ]}
                        />
                    </Box>
                </MainCard>
            </MainLayout>
        </>
    )
}

export default Patients
