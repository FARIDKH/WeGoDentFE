import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core'
import axios from 'axios'
import { Formik } from 'formik'
import React from 'react'
import { forwardRef, useState } from 'react'
import { useMutation } from 'react-query'
import useUser from '../../lib/useUser'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import Input from '../../ui-component/Form/Input'
import BlogCategorySelect from '../../ui-component/Form/selects/BlogCategorySelect'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import { blogValidationSchema } from './validation'

interface IProps {
    onSuccess?: () => void
}

const CreateEditForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { user } = useUser()
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)

    const { isLoading, mutate } = useMutation(
        (values: any) => (data?.id ? axios.put(`/api/blogposts/${data?.id}`, values) : axios.post('/api/blogposts', values)),
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.id ? 'Blog has been updated successfully' : 'Blog has been created successfully',
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
                    title: data?.title ?? '',
                    content: data?.content ?? '',
                    blogCategoryDTOS: data?.blogCategoryDTOS ?? [],
                    authorId: user?.id,
                }}
                validationSchema={blogValidationSchema}
                onSubmit={(values) => mutate(values)}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <DialogTitle>
                            <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.id ? 'Update' : 'Create'}</span>
                        </DialogTitle>
                        <DialogContent dividers>
                            <BlogCategorySelect
                                name="blogCategoryDTOS"
                                value={values?.blogCategoryDTOS}
                                onChange={(value) => setFieldValue('blogCategoryDTOS', value)}
                                isLoading={isLoading}
                                onBlur={handleBlur}
                                error={errors?.blogCategoryDTOS as string}
                                isTouched={!!touched.blogCategoryDTOS}
                            />

                            <Input
                                id="title"
                                label="Title"
                                name="title"
                                isTouched={touched.title}
                                error={errors.title}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.title}
                            />

                            <Input
                                id="content"
                                label="Content"
                                name="content"
                                isTouched={touched.content}
                                error={errors.content}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                disabled={isLoading}
                                value={values?.content}
                                multiline
                                rows={4}
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
