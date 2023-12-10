import React, { useRef, useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import MainLayout from '../../../layout/admin/MainLayout'
import MainCard from '../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../ui-component/PaginatedTableGenerator'
import CreateButtonFab from '../../../ui-component/CreateButtonFab'
import CreateEditForm from '../../../modules/treatments/CreateEdit'
import CreateEditPhaseForm from '../../../modules/treatments/CreateEditPhase'
import { trimString } from '../../../utils/string'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ClinicSelect from '../../../ui-component/Form/selects/ClinicSelect'

const Treatments = () => {
    const createEditRef = useRef(null)
    const createEditPhaseRef = useRef(null)

    const [selectedClinicId, setSelectedClinicId] = useState(null)

    const { data, isFetching, isError, refetch } = useQuery(['Treatment', selectedClinicId], async ({ signal }) => {
        if (selectedClinicId == null) return []
        const result = await axios(`/api/clinics/${selectedClinicId}/treatments`, { signal })
        return result.data
    })

    // ... other code ...

    const handleClinicSelect = (clinicId) => {
        setSelectedClinicId(clinicId)
        // Call refetch or other necessary actions after clinic selection
    }

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    Treatments
                </Typography>

                <Typography variant="h6" mb={2}>
                    Select clinic:
                    <ClinicSelect
                        onChange={(event) => handleClinicSelect(event.target.value)}
                        fetch={true}
                        name={''}
                        value={undefined}
                        onBlur={undefined}
                        error={''}
                    />
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
                                    id: 'name',
                                    numeric: false,
                                    label: 'Treatment name',
                                    align: 'left',
                                },
                                {
                                    id: 'description',
                                    numeric: false,
                                    label: 'Treatment Description',
                                    align: 'left',
                                },
                                {
                                    id: 'cost',
                                    numeric: false,
                                    label: 'Cost',
                                    align: 'left',
                                },
                            ]}
                            actions={[
                                {
                                    label: 'Edit',
                                    onClick: (treatment) => createEditRef?.current?.open(treatment),
                                },
                                {
                                    label: 'Phases',
                                    onClick: (treatment) => createEditPhaseRef?.current?.open(treatment),
                                },
                            ]}
                        />
                    </Box>
                </MainCard>

                {selectedClinicId && (
                    <>
                        <CreateButtonFab onClick={() => createEditRef?.current?.open()} />
                        <CreateEditForm ref={createEditRef} onSuccess={refetch} clinicId={selectedClinicId} />
                        <CreateEditPhaseForm ref={createEditPhaseRef} onSuccess={refetch} />
                    </>
                )}
            </MainLayout>
        </>
    )
}

export default Treatments

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['doctor'])),
        },
    }
}
