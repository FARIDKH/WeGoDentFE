import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core'
import axios from '../../utils/axios'
import { Formik } from 'formik'
import React from 'react'
import { forwardRef, useState } from 'react'
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

    const { isLoading, mutate } = useMutation(

        

        (values: any) => (data?.id ? axios.patch(`/api/clinics/${data?.id}`, values) : axios.post('/api/clinics', values)),
        
        {
            
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.id ? 'Clinic has been updated successfully' : 'Doctor has been created successfully',
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

    
    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30%', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
            <Formik
                initialValues={{
                    name: data?.name ?? '',
                    officeLocationName: data?.officeLocationName ?? '',
                    managerId: data?.id ? data?.manager?.id : data?.managerId ?? [],
                    email: data?.email ?? '',
                }}
                onSubmit={(values) => {
                    let payload;
                    if (data?.id) {
                        // When updating
                        payload = {
                            name: values?.name,
                            officeLocationName: values?.officeLocationName,
                            managersId: [{ id: values?.managerId }],
                            email: values?.email,
                        };
                    } else {
                        // When creating
                        payload = {
                            name: values?.name,
                            officeLocationName: values?.officeLocationName,
                            managersId: [values?.managerId],
                            email: values?.email,
                        };
                    }
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

                        <Input
                            id="name"
                            label="Clinic name"
                            name="name"
                            isTouched={touched.name}
                            error={errors.name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isLoading}
                            value={values?.name}
                        />

                        <Input
                            id="officeLocationName"
                            label="Office Location"
                            name="officeLocationName"
                            isTouched={touched.officeLocationName}
                            error={errors.officeLocationName}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isLoading}
                            value={values?.officeLocationName}
                        />


                        <ManagerSelect
                                name="managerId"
                                value={values?.managerId}
                                onChange={(value) => setFieldValue('managerId',value?.target?.value)}
                                isLoading={isLoading}
                                onBlur={handleBlur}
                                error={errors?.managerId as string}
                                isTouched={!!touched.managerId} />


                        <Input
                            id="email"
                            label="Email"
                            name="email"
                            type="email"
                            isTouched={touched.email}
                            error={errors.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled={isLoading}
                            value={values?.email}
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
