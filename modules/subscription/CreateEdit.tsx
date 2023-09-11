import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Grid, Box, Typography, List, ListItem } from '@material-ui/core'
import axios from '../../utils/axios'
import { Formik } from 'formik'
import React from 'react'
import { forwardRef, useState, useEffect } from 'react'
import { useMutation } from 'react-query'
import useUser from '../../lib/useUser'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import Input from '../../ui-component/Form/Input'
import ManagerSelect from '../../ui-component/Form/selects/ManagerSelect'
import { useOpenState } from '../../ui-component/hooks/useOpenState'

interface IProps {
    onSuccess?: () => void
}




const CreateEditForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        const storedCard = localStorage.getItem('selectedCard');
        if (storedCard) {
            setSelectedCard(storedCard);
        }
    }, []);

    const checkBillingDetails = async () => {
        try {
            console.log("23232")
            console.log(data)
            const response = await axios.get(`/api/clinic/${data}/billing`);
            if (!response.data) {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'Please update billing details',
                    variant: 'alert',
                    alertSeverity: 'warning',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                });
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error fetching billing details:", error);
            store.dispatch({
                type: SNACKBAR_OPEN,
                open: true,
                message: 'Please update billing details',
                variant: 'alert',
                alertSeverity: 'warning',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
            });
            return false;
        }
    };

    const handleCardClick = (priceId) => {
        
        setSelectedCard(priceId);
        localStorage.setItem('selectedCard', priceId);
    };
    
    
    const { isLoading, mutate } = useMutation(
        async (values: any) => {
            await checkBillingDetails();
            return data?.id ? axios.patch(`/api/stripe/create-subscription`, values) : axios.post('/api/stripe/create-subscription', values);
        },
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.id ? 'Subscription has been updated successfully' : 'Subscription has been created successfully',
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
        <Dialog sx={{ '& .MuiDialog-paper': { width: '60%', minHeight: 400, textAlign : 'center' } }} maxWidth="lg" open={isOpen}>
            <Formik
                initialValues={{
                    clinicId: data ?? '',
                    planType: data?.planType ?? '' 
                }}
                onSubmit={(values) => {
                    let payload;
                    

                    if (data?.id) {
                        // When updating
                        payload = {
                            name: values?.clinicId,
                            planType: selectedCard
                        };
                    } else {
                        // When creating
                        payload = {
                            name: values?.clinicId,
                            planType: selectedCard
                        };
                    }
                    
                    console.log(payload)
                    
                    mutate(payload);
                }}
                enableReinitialize={true} 
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values,setFieldValue }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <DialogTitle>
                        <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.id ? 'Update' : 'Create'} Clinic</span>
                    </DialogTitle>
                    <DialogContent dividers>
                        
                        <Grid  container spacing={10}>
                            
                            <Grid  item xs={1}></Grid>
                            <Grid onClick={() => handleCardClick("PLAN_ECONOMIC")} sx={{ color : 'white' }} item xs={5}>
                                <Box
                                    
                                    sx={{
                                        width: '100%',
                                        height: 450,
                                        
                                        backgroundColor: selectedCard === "PLAN_ECONOMIC" ? '#069E71': 'primary.dark',
                        
                                        padding: 2,
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                            opacity: [0.9, 0.8, 0.7],
                                        },
                                        cursor:'pointer'
                                    }}
                                >
                                <Typography sx={{ color : 'white'}}  variant="h6">
                                    Economic Plan
                                </Typography>
                                <Typography sx={{ color : 'white'}}>
                                    Top choice for early individual dentist
                                </Typography>
                                <Typography  sx={{ color : 'white'}} variant="h4" gutterBottom>
                                    HUF 15,000
                                </Typography>
                                <Typography>per month</Typography>
                                
                                <Typography sx={{ color : 'white'}} variant="body2">
                                    This includes:
                                </Typography>
                                <List>
                                    <ListItem>Treatment module which consists of 100+ oral treatments</ListItem>
                                    <ListItem>Planning module for patients</ListItem>
                                    <ListItem>Oral visualisation for each patient</ListItem>
                                    <ListItem>Appointment scheduling module</ListItem>
                                    <ListItem>Treatment tracking</ListItem>
                                </List>
                                </Box>
                            </Grid>

                            <Grid onClick={() => handleCardClick("PLAN_PREMIUM")} sx={{ color : 'white' }} item xs={5}>

                                <Box
                                    sx={{
                                        width: '100%',
                                        height: 450,
                                        backgroundColor: selectedCard === "PLAN_PREMIUM" ? '#069E71' :'primary.dark',
                        
                                        padding: 2,
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                            opacity: [0.9, 0.8, 0.7],
                                            cursor:'pointer'
                                        },
                                    }}
                                >
                                    <Typography  sx={{ color : 'white' }} variant="h5" gutterBottom>
                                        Premium Plan
                                    </Typography>
                                    <Typography   sx={{ color : 'white' }} variant="h6">
                                        Preferred by small-mid sized dental clinics
                                    </Typography>
                                    <Typography  sx={{ color : 'white' }} variant="h4" gutterBottom>
                                        HUF 30,000
                                    </Typography>
                                    <Typography>per month</Typography>
                                    
                                    <Typography  sx={{ color : 'white' }} variant="body2">
                                        This includes:
                                    </Typography>
                                    <List>
                                        <ListItem>Creation of up to 3 doctor chairs</ListItem>
                                        <ListItem>Accounting of clinic</ListItem>
                                        <ListItem>Treatment module for each doctor</ListItem>
                                        <ListItem>Analysis dashboard for clinic</ListItem>
                                        <ListItem>Everything in economic plan</ListItem>
                                    </List>
                                </Box>
                            </Grid>

                            <Grid  item xs={1}></Grid>
                        </Grid>

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
                            {isLoading && <CircularProgress size={20}  />}
                        </Button>
                    </DialogActions>
                </form>
            )}

            </Formik>
        </Dialog>
    )
    

})

export default CreateEditForm
