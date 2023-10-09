import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box } from '@material-ui/core'
import axios from '../../utils/axios'
import React, { useState, forwardRef } from 'react'
import { useMutation, useQuery } from 'react-query'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import Input from '../../ui-component/Form/Input'
import { useOpenState } from '../../ui-component/hooks/useOpenState'

interface IProps {
    onSuccess?: () => void
}

const CreateEditPictureForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)
    const [file, setFile] = useState(null)

    const { data: clinicPicture } = useQuery(
        ['ClinicImage', data?.clinicId],
        async () => {
            const response = await axios.get(`/api/clinics/${data?.clinicId}/profile-picture`, {
                responseType: 'arraybuffer',
                showErrorResponse: false,
            })

            return new Blob([response?.data])
        },
        {
            enabled: !!data?.clinicId,
        }
    )

    const imageUrl = file ? URL.createObjectURL(file) : clinicPicture && URL.createObjectURL(clinicPicture)

    const { isLoading, mutate } = useMutation(
        async () => {
            const formData = new FormData()
            formData.append('image', file)
            return await axios.post(`/api/clinics/${data?.clinicId}/profile-picture`, formData)
        },
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: data?.clinicId ? 'Clinic has been updated successfully' : 'Doctor has been created successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })

                handleClose()
                onSuccess()
            },
            onError: (err) => {
                console.log(err)
            },
        }
    )

    const handleClose = () => {
        setFile(null)
        setData(null)
        close()
    }

    const handleOpen = (data = null) => {
        data && setData(data)
        open()
    }

    React.useImperativeHandle(ref, () => ({ open: handleOpen }), [])

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30%', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
            <DialogTitle>
                <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.clinicId ? 'Update' : 'Create'} Clinic</span>
            </DialogTitle>
            <DialogContent dividers>
                <Input
                    id="image"
                    name="image"
                    type="file"
                    value={file}
                    onChange={(event) => {
                        const file = event?.target?.files?.[0]
                        if (file) {
                            setFile(file)
                        }
                    }}
                    disabled={isLoading}
                />

                {imageUrl && (
                    <Box width={200} height={200} border={1} borderColor="grey.300" borderRadius={4} overflow="hidden" mt={2} mx="auto">
                        <img src={imageUrl} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                )}
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
                    onClick={() => mutate()}
                    variant="contained"
                    color="secondary"
                    style={{ margin: '0 10px' }}
                >
                    Submit
                    {isLoading && <CircularProgress size={20} />}
                </Button>
            </DialogActions>
        </Dialog>
    )
})

export default CreateEditPictureForm
