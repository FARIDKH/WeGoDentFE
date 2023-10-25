import React, { useRef, useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import MainLayout from '../../../layout/admin/MainLayout'
import MainCard from '../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../ui-component/PaginatedTableGenerator'
import CreateButtonFab from '../../../ui-component/CreateButtonFab'
import CreateEditForm from '../../../modules/receptionists/CreateEdit'
import ClinicSelectionModal from '../../../modules/clinics/ClinicSelectionModal'
import DeleteForm from '../../../modules/Doctor/Delete'
import { trimString } from '../../../utils/string'
import { store } from '../../_app'

import { SNACKBAR_OPEN } from '../../../store/actions'

import { serverSideTranslations } from "next-i18next/serverSideTranslations";



const Receptionists = () => {
    const createEditRef = useRef(null)
    const deleteRef = useRef(null)
    const clinicSelectionRef = useRef(null);

    const { data: clinicsData } = useQuery('Clinics', async ({ signal }) => {
        const result = await axios(`/api/clinics/all`, { signal });
        return result.data;
    });

    const { data: receptionistsData, isFetching, isError, refetch } = useQuery(['ReceptionistsByClinics', clinicsData], async ({ signal }) => {
        const allReceptionists = [];
        for (const clinic of clinicsData) {
            const response = await axios(`/api/clinics/${clinic?.clinicId}/receptionist`, { signal });
            allReceptionists.push(...response.data);
        }
        return allReceptionists;
    }, { enabled: !!clinicsData });  // only run when clinicsData is available


    const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
    

   

    const handleClinicSelected = async (clinicId) => {
        // Fetch the clinic's quota and current doctor count
        // This is a placeholder, replace with your actual API call or method
        


        
        
    };

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    List of Receptionists
                </Typography>

                <MainCard>
                    <Box px={2}>
                        <PaginatedTableGenerator
                            isLoading={isFetching}
                            isError={isError}
                            data={{
                                data: receptionistsData,
                            }}
                            columns={[
                                {
                                    id: 'id',
                                    numeric: false,
                                    label: 'ID',
                                    align: 'left',
                                },
                                {
                                    id: 'fullName',
                                    numeric: false,
                                    label: 'Receptionist',
                                    align: 'left',
                                    renderAs: (receptionist) => (receptionist?.firstName + " " + receptionist?.lastName).toString()
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
                
                {/* <CreateButtonFab onClick={() => clinicSelectionRef?.current?.open()} /> */}
                <ClinicSelectionModal ref={clinicSelectionRef} onSuccess={handleClinicSelected} />
            
                <CreateEditForm ref={createEditRef} onSuccess={refetch} />
                <DeleteForm ref={deleteRef} onSuccess={refetch} />
            </MainLayout>
        </>
    )
}

export default Receptionists

export const getStaticProps = async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["doctor"])),
      },
    };
  };