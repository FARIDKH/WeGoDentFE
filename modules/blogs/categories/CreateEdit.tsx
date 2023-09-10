import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core'
import axios from 'axios'
import { Formik } from 'formik'
import React from 'react'
import { forwardRef, useState } from 'react'
import { useMutation } from 'react-query'
import { store } from '../../../pages/_app'
import { SNACKBAR_OPEN } from '../../../store/actions'
import Input from '../../../ui-component/Form/Input'
import { useOpenState } from '../../../ui-component/hooks/useOpenState'
import { categoryValidationSchema } from '../validation'

interface IProps {
    onSuccess?: () => void
}

const CreateEditForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)

    const { isLoading, mutate } = useMutation(
        (name: string) => (data?.id ? axios.put(`/api/blogcategory/${data?.id}`, { name }) : axios.post('/api/blogcategory', { name })),
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.id ? 'Category has been updated successfully' : 'Category has been created successfully',
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
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30rem', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
            <Formik
                initialValues={{
                    name: data?.name ?? '',
                }}
                validationSchema={categoryValidationSchema}
                onSubmit={(values) => mutate(values.name)}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <DialogTitle>
                            <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.id ? 'Update' : 'Create'}</span>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Input
                                id="name"
                                label="Category"
                                name="name"
                                isTouched={touched.name}
                                error={errors.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.name}
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
