import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, TextField } from '@material-ui/core'
import axios from '../../utils/axios'
import { Formik } from 'formik'
import React from 'react'
import { forwardRef, useState } from 'react'
import { useMutation } from 'react-query'
import useUser from '../../lib/useUser'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import Input from '../../ui-component/Form/Input'
import DoctorMultipleSelect from '../../ui-component/Form/selects/DoctorMultipleSelect'
import { useOpenState } from '../../ui-component/hooks/useOpenState'

interface IProps {
    onSuccess?: () => void
}

const AddDoctorForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { user } = useUser()
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)
    const [doctorQuota, setDoctorQuota] = useState<number | null>(null);


    const quotaMutation = useMutation(
        () => axios.post(`/api/clinics/${data?.clinicId}/add-doctor-quota?numberOfDoctors=${doctorQuota}`),
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message:'Quota increased successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                });
                setDoctorQuota(null); // Reset the input after successful update
            },
            onError: (error) => {
            // Handle the error accordingly, e.g.:
            console.error(error);
            store.dispatch({
                type: SNACKBAR_OPEN,
                open: true,
                message: 'An error occurred!',
                variant: 'alert',
                alertSeverity: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
            });
        }
        }
    );
    
    const { isLoading, mutate } = useMutation(

        
        

        (values: any) => (data?.id ? 
            axios.put(`/api/clinics/${data?.clinicId}/doctors`, values?.doctorIds ) 
            : axios.post(`/api/clinics/${data?.clinicId}/doctors`, values?.doctorIds )),
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message:'Doctor has been assigned to clinic successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })

                handleClose()
                onSuccess()
            }
        }
    )

    const handleClose = () => {
        setData(null)
        close()
    }

    const handleOpen = (data = null) => {
        data && setData(data)
        open()
    }

    React.useImperativeHandle(
        ref,
        () => ({
            open: handleOpen,
        }),
        []
    )

    

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30rem', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
            <Formik
                initialValues={{
                    doctorIds: data?.doctorList?.map(doctor => doctor?.id) ?? [],
                }}
                onSubmit={(values) => {
                    const doctorIds = values?.doctorIds.map(doctor => doctor?.id);
                    mutate({doctorIds});
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <DialogTitle>
                            <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.id ? 'Update' : 'Create'}</span>
                        </DialogTitle>
                        <DialogContent dividers>
                            <DoctorMultipleSelect
                                name="doctorIds"
                                value={values?.doctorIds}
                                onChange={(value) => setFieldValue('doctorIds', value)}
                                isLoading={isLoading}
                                onBlur={handleBlur}
                                error={errors?.doctorIds as string}
                                isTouched={!!touched.doctorIds}
                            />

                            <TextField
                                    type="number"
                                    label="Increase doctor quota (Per Doctor / 8000 HUF )"
                                    value={doctorQuota || ''}
                                    onChange={(e) => setDoctorQuota(Number(e.target.value))}
                                    variant="outlined"
                                    style={{ marginTop: '1rem', maxWidth: '375px', width: '100%', color:'white' }}
                                />

                            
                        </DialogContent>
                        <DialogActions>
                            <Button disableElevation disabled={isLoading} onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                disableElevation
                                disabled={isLoading}
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                                style={{ margin: '0 10px' }}
                            >
                                Submit
                                {isLoading && <CircularProgress size={20} />}
                            </Button>
                            <Button
                                disableElevation
                                disabled={isLoading || !doctorQuota} // Disable if no quota is set
                                size="large"
                                onClick={() => quotaMutation.mutate()}
                                variant="contained"
                                color="primary"
                                style={{ margin: '0 10px' }}
                            >
                                Increase Quota
                                {quotaMutation.isLoading && <CircularProgress size={20} />}
                            </Button>
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    )
})

export default AddDoctorForm
