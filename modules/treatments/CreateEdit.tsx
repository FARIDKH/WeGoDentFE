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
import { useOpenState } from '../../ui-component/hooks/useOpenState'

interface IProps {
    onSuccess?: () => void
}

const CreateEditForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { user } = useUser()
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)

    const { isLoading, mutate } = useMutation(
        (values: any) => (data?.id ? axios.put(`/api/treatment/${data?.id}`, values) : axios.post('/api/treatment', values)),
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.id ? 'Treatment has been updated successfully' : 'Treatment has been created successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })
                
                handleClose()
                onSuccess()
            },
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
                    description: data?.description ?? '',
                    cost: data?.cost ?? '',
                }}
                onSubmit={(values) => mutate(values)}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <DialogTitle>
                            <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.id ? 'Update' : 'Create'}</span>
                        </DialogTitle>
                        <DialogContent dividers>
                            
                            <Input
                                id="name"
                                label="Name"
                                name="name"
                                isTouched={touched.name}
                                error={errors.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.name}
                            />

                            <Input
                                id="description"
                                label="Description"
                                name="description"
                                isTouched={touched.description}
                                error={errors.description}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.description}
                                multiline
                                rows={4}
                            />

                            <Input
                                id="cost"
                                label="Total cost in Hungarian Forint"
                                name="cost"
                                type="number"
                                isTouched={touched.cost}
                                error={errors.cost}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.cost}
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
