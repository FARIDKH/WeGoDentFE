import React, { useRef } from 'react'

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

import { serverSideTranslations } from "next-i18next/serverSideTranslations";


const Treatments = () => {
    const createEditRef = useRef(null)
    const createEditPhaseRef = useRef(null)

    const { data, isFetching, isError, refetch } = useQuery(['Treatment'], async ({ signal }) => {
        const result = await axios(`/api/treatment`, { signal })
        return result.data
    })

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    Treatments
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
                                    align: 'left'
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
                                }
                                
                            ]}
                        />
                    </Box>
                </MainCard>

                <CreateButtonFab onClick={() => createEditRef?.current?.open()} />

                <CreateEditForm ref={createEditRef} onSuccess={refetch} />
                <CreateEditPhaseForm ref={createEditPhaseRef} onSuccess={refetch} />
            </MainLayout>
        </>
    )
}

export default Treatments

export const getStaticProps = async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["doctor"])),
      },
    };
  };