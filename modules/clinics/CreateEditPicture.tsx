import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box } from '@material-ui/core';
import axios from '../../utils/axios';
import { Formik } from 'formik';
import React, { useState, forwardRef , useEffect} from 'react';
import { useMutation } from 'react-query';
import useUser from '../../lib/useUser';
import { store } from '../../pages/_app';
import { SNACKBAR_OPEN } from '../../store/actions';
import Input from '../../ui-component/Form/Input';
import ClinicTypeSelect from '../../ui-component/Form/selects/ClinicTypeSelect';
import ManagerSelect from '../../ui-component/Form/selects/ManagerSelect';
import { useOpenState } from '../../ui-component/hooks/useOpenState';

interface IProps {
    onSuccess?: () => void;
}

const CreateEditPictureForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isOpen, open, close } = useOpenState();
    const [data, setData] = useState(null);
    const [clinicPicture, setClinicPicture] = useState<File | null>(null);

    useEffect(() => {
        // Fetch the image URL whenever clinicId changes
        const fetchImage = async () => {
            try {
                const response = await axios.get(`/api/clinics/${data?.clinicId}/picture`);
                // Assuming the response contains the direct image URL
                setClinicPicture(response.data);
            } catch (error) {
                console.error("Failed to fetch the image:", error);
            }
        };

        if (data?.clinicId) {
            fetchImage();
        }

    }, [data?.clinicId]); // Re-run the effect whenever clinicId changes


    

    const { isLoading, mutate } = useMutation(
        async (values: any) => 
        
        {
            const formData = new FormData();
            formData.append('profilePicture', values?.profilePicture);
            return await axios.post(`/api/clinics/${data?.clinicId}/picture`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        ,
        {
            onSuccess: (responseData) => {
                
                

                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.clinicId ? 'Clinic has been updated successfully' : 'Doctor has been created successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                });

                handleClose();
                onSuccess();
            },
            onError: (err) => {
                console.log(err);
            }
        }
    );

    const handleClose = () => {
        setData(null);
        close();
    };

    const handleOpen = (data = null) => {
        data && setData(data);
        open();
    };

    React.useImperativeHandle(ref, () => ({ open: handleOpen }), []);

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30%', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
            <Formik
                initialValues={{
                    profilePicture: null,
                }}
                onSubmit={(values) => {
                    
                    mutate(values);
                }}
                enableReinitialize={true}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <DialogTitle>
                            <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.clinicId ? 'Update' : 'Create'} Clinic</span>
                        </DialogTitle>
                        <DialogContent dividers>
                            {/*  id="description"
                            label="Description"
                            name="description"
                            type="description"
                            isTouched={touched.description}
                            error={errors.description}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isLoading}
                            value={values?.description}... other components ... */}
                            <Box 
                                width={200} 
                                height={200} 
                                border={1} 
                                borderColor="grey.300" 
                                borderRadius={4} 
                                overflow="hidden" 
                                mt={2} 
                                mx="auto">
                                {values.profilePicture && (
                                    <img src={values.profilePicture} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                            </Box>

                            <Input
                                id="profilePicture"
                                label="Clinic Picture"
                                name="profilePicture"
                                type="file"
                                onChange={(event) => {
                                    const file = event?.target?.files?.[0];
                                    if (file) {
                                        // const reader = new FileReader();
                                        // reader.onload = (e) => {
                                        //     setFieldValue('profilePicture', e.target?.result as string);
                                        // }
                                        // reader.readAsDataURL(file);
                                        
                                        setFieldValue('profilePicture', file);

                                    }
                                }}
                                isTouched={touched.profilePicture}
                                error={errors.profilePicture}
                                onBlur={handleBlur}
                                disabled={isLoading}
                            />
                            {/* ... other components ... */}
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
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
});

export default CreateEditPictureForm;
