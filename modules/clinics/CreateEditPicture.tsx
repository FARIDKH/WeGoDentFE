import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box } from '@material-ui/core'
import axios from '../../utils/axios'
import React, { useState, forwardRef } from 'react'
import { useMutation } from 'react-query'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import Input from '../../ui-component/Form/Input'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import ClinicPicture from './ClinicPicture'
import { storage } from '../../utils/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

interface IProps {
    onSuccess?: () => void
}

const CreateEditPictureForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)
    const [file, setFile] = useState(null)

    // const { isLoading, mutate } = useMutation(
    //     async () => {
    //         const formData = new FormData()

    //         formData.append('image', file)
    //         return await axios.post(`/api/clinic/${data?.clinicId}/upload`, formData)
    //     },
    //     {
    //         onSuccess: () => {
    //             store.dispatch({
    //                 type: SNACKBAR_OPEN,
    //                 open: true,
    //                 message: 'Clinic photo has been updated successfully',
    //                 variant: 'alert',
    //                 alertSeverity: 'success',
    //                 anchorOrigin: { vertical: 'top', horizontal: 'center' },
    //             })

    //             handleClose()
    //             onSuccess()
    //         },
    //         onError: (err) => {
    //             console.log(err)
    //         },
    //     }
    // )
    const { isLoading, mutate } = useMutation(
        async () => {
            if (!file) {
                throw new Error('No file to upload.')
            }

            // Create a reference to the location with the desired file name in Firebase storage
            const fileRef = storageRef(storage, `clinic/${data?.clinicId}/profile-picture`)

            // Upload the file to Firebase storage
            const uploadTaskSnapshot = await uploadBytes(fileRef, file)

            // After successful upload, get the download URL
            const downloadUrl = await getDownloadURL(uploadTaskSnapshot.ref)

            // You can return the download URL if needed
            return downloadUrl
        },
        {
            onSuccess: (downloadUrl) => {
                // Dispatch success action with the URL if needed
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'Clinic photo has been updated successfully',
                    variant: 'alert',
                    alertSeverity: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'center' },
                })

                handleClose()
                onSuccess?.()

                // If you want to do something with the download URL you can do it here
                console.log('File available at', downloadUrl)
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
                    inputProps={{
                        accept: 'image/*',
                    }}
                    value={file}
                    onChange={(event) => {
                        const file = event?.target?.files?.[0]
                        if (file) {
                            setFile(file)
                        }
                    }}
                    disabled={isLoading}
                />

                <Box mt={2} mx="auto">
                    <ClinicPicture file={file} clinic={data} />
                </Box>
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
