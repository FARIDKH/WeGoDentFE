import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box } from '@material-ui/core'
import axios from '../../utils/axios'
import React, { useState, forwardRef } from 'react'
import { useMutation } from 'react-query'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import Input from '../../ui-component/Form/Input'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import DoctorPicture from './DoctorPicture'
import { storage } from '../../utils/firebase'; // make sure to import your Firebase storage instance
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';


interface IProps {
    onSuccess?: () => void
}

const CreateEditPictureForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)
    const [file, setFile] = useState(null)
    console.log(data)
    const { isLoading, mutate } = useMutation(
        async () => {
            if (!file) {
              throw new Error('No file to upload.');
            }
            
            
            // Firebase Storage reference
            const fileRef = storageRef(storage, `doctor/${data?.id}/profile-picture`);
      
            // Upload the file
            const uploadTaskSnapshot = await uploadBytes(fileRef, file);
      
            // Get the download URL
            return getDownloadURL(uploadTaskSnapshot.ref);
          },
        {
            onSuccess: () => {
                store.dispatch({
                    type: SNACKBAR_OPEN,
                    open: true,
                    message: 'Doctor photo has been updated successfully',
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
                <span style={{ fontSize: 22, fontWeight: 'bold' }}>Update picture of {data?.userDTO?.firstName}  {data?.userDTO?.lastName}</span>
            </DialogTitle>
            <DialogContent dividers>
                <Input
                    id="profilePicture"
                    name="profilePicture"
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
                    <DoctorPicture file={file} doctor={data} />
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
