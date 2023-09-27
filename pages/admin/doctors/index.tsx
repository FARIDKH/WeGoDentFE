import React, { useRef, useState } from 'react'

import { Box, Typography } from '@material-ui/core'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import MainLayout from '../../../layout/admin/MainLayout'
import MainCard from '../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../ui-component/PaginatedTableGenerator'
import CreateButtonFab from '../../../ui-component/CreateButtonFab'
import CreateEditForm from '../../../modules/Doctor/CreateEdit'
import ClinicSelectionModal from '../../../modules/clinics/ClinicSelectionModal'
import DeleteForm from '../../../modules/Doctor/Delete'
import { trimString } from '../../../utils/string'
import { store } from '../../_app'

import { SNACKBAR_OPEN } from '../../../store/actions'

import { serverSideTranslations } from "next-i18next/serverSideTranslations";



const Doctors = () => {
    const createEditRef = useRef(null)
    const deleteRef = useRef(null)
    const clinicSelectionRef = useRef(null);


    const { data, isFetching, isError, refetch } = useQuery(['Doctors'], async ({ signal }) => {
        const result = await axios(`/api/doctor`, { signal })
        return result.data
    })
    const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
    

    const fetchClinicData = async (clinicId) => {
        const response = await axios.get(`/api/clinics/${clinicId}`);
        const data = response.data;
        return {
            id: data?.clinicId,
            quota: data?.doctorQuota,
            currentCount: data?.currentDoctorCount,
        };
    };

    const handleClinicSelected = async (clinicId) => {
        // Fetch the clinic's quota and current doctor count
        // This is a placeholder, replace with your actual API call or method
        const { id, quota, currentCount } = await fetchClinicData(clinicId);


        
        
        if (quota > currentCount) {
            
            setSelectedClinicId(id)
            createEditRef?.current?.open();
            store.dispatch({
                type: SNACKBAR_OPEN,
                open: true,
                message: 'Clinic has been selected!',
                variant: 'alert',
                alertSeverity: 'success',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
            })
        } else {
            store.dispatch({
                type: SNACKBAR_OPEN,
                open: true,
                message: 'Increase the quota!',
                variant: 'alert',
                alertSeverity: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
            })
        }
    };

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    List of dentists
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
                                    id: 'Doctor',
                                    numeric: false,
                                    label: 'Doctor',
                                    align: 'left',
                                    renderAs: ({ userDTO }) => ("Dr. " + userDTO?.firstName + " " + userDTO?.lastName).toString()
                                },
                                {
                                    id: 'clinicName',
                                    numeric: false,
                                    label: 'Associated Clinic',
                                    align: 'left',
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
                
                <CreateButtonFab onClick={() => clinicSelectionRef?.current?.open()} />
                <ClinicSelectionModal ref={clinicSelectionRef} onSuccess={handleClinicSelected} />
            
                <CreateEditForm selectedClinicId={selectedClinicId} ref={createEditRef} onSuccess={refetch} />
                <DeleteForm ref={deleteRef} onSuccess={refetch} />
            </MainLayout>
        </>
    )
}

export default Doctors

export const getStaticProps = async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["doctor"])),
      },
    };
  };