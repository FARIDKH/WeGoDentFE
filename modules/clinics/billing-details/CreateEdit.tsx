import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core'
import axios from '../../../utils/axios'
import { Formik } from 'formik'
import React from 'react'
import { forwardRef, useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import useUser from '../../../lib/useUser'
import { store } from '../../../pages/_app'
import { SNACKBAR_OPEN } from '../../../store/actions'
import Input from '../../../ui-component/Form/Input'
import ManagerSelect from '../../../ui-component/Form/selects/ManagerSelect'
import { useOpenState } from '../../../ui-component/hooks/useOpenState'

interface IProps {
    onSuccess?: () => void
}

const CreateEditForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)


    const [initialValues, setInitialValues] = useState({
        city: '',
        country: '',
        zip: '',
        street: '',
        state: '',
    });

    useEffect(() => {
        if (data?.clinicId) {
            axios.get(`/api/clinic/${data?.clinicId}/billing`)
                .then(response => {
                    const { city, country, zip, street, state } = response.data;
                    setInitialValues({ city, country, zip, street, state });
                })
                .catch(error => {
                    console.error("Error fetching billing details:", error);
                });
        }
    }, [data?.clinicId]);

    const { isLoading, mutate } = useMutation(

        

        (values: any) => (data?.id ? axios.patch(`/api/clinic/${data?.clinicId}/billing`, values) : axios.post(`/api/clinic/${data?.clinicId}/billing`, values)),
        
        {
            
            onSuccess: async (response, variables) => {
                if (!data?.id) { // If data.id doesn't exist, it's a new creation
                    await createCustomer(variables);
                }
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.id ? 'Billing details has been updated successfully' : 'Billing details has been created successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })

                handleClose()
                onSuccess()
            },
            onError: (err) => {
                console.log(err)
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

    const createCustomer = async (values) => {
        
        const payload = {
            email: data?.email, // Assuming data contains the clinic email
            name: data?.name,   // Assuming data contains the clinic name
            ...values
        };
        console.log(payload)
        try {
            await axios.post('/api/stripe/create-customer', payload);
        } catch (error) {
            console.error("Error creating Stripe customer:", error);
            // Handle the error appropriately, e.g., show a notification to the user
        }
    };
    return (
        
        
            <Dialog sx={{ '& .MuiDialog-paper': { width: '30%', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
                        <Formik
                            initialValues={initialValues}
                            onSubmit={(values) => {
                                let payload;
                                if (data?.id) {
                                    // When updating
                                    payload = {
                                        city: values?.city,
                                        country: values?.country,
                                        zip: values?.zip,
                                        street: values?.street,
                                        state: values?.state
                                    };
                                } else {
                                    // When creating
                                    payload = {
                                        city: values?.city,
                                        country: values?.country,
                                        zip: values?.zip,
                                        street: values?.street,
                                        state: values?.state
                                    };
                                }
                                mutate(payload);
                            }}
                            enableReinitialize={true}
                        >
                            {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                                
                                <form noValidate onSubmit={handleSubmit}>
                                    <DialogTitle>
                                        <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.id ? 'Update' : 'Create'} details of clinic for billing</span>
                                    </DialogTitle>
                                    <DialogContent dividers>
                                        <Input
                                            id="city"
                                            label="City"
                                            name="city"
                                            isTouched={touched.city}
                                            error={errors.city}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            value={values?.city}
                                        />

                                        <Input
                                            id="country"
                                            label="Country"
                                            name="country"
                                            isTouched={touched.country}
                                            error={errors.country}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            value={values?.country}
                                        />

                                        <Input
                                            id="zip"
                                            label="ZIP Code"
                                            name="zip"
                                            isTouched={touched.zip}
                                            error={errors.zip}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            value={values?.zip}
                                        />

                                        <Input
                                            id="street"
                                            label="Street"
                                            name="street"
                                            isTouched={touched.street}
                                            error={errors.street}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            value={values?.street}
                                        />

                                        <Input
                                            id="state"
                                            label="State"
                                            name="state"
                                            isTouched={touched.state}
                                            error={errors.state}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            disabled={isLoading}
                                            value={values?.state}
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
                                    </DialogActions>
                                </form>
                            )}
                        </Formik>
                    </Dialog>




                )
    

})

export default CreateEditForm
