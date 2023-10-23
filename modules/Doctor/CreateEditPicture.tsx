import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Box } from '@material-ui/core'
import axios from '../../utils/axios'
import React, { useState, forwardRef } from 'react'
import { useMutation } from 'react-query'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import Input from '../../ui-component/Form/Input'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import DoctorPicture from './DoctorPicture'

interface IProps {
    onSuccess?: () => void
}

const CreateEditPictureForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)
    const [file, setFile] = useState(null)

    const { isLoading, mutate } = useMutation(
        async () => {
            const formData = new FormData()

            formData.append('image', file)
            return await axios.post(`/api/doctor/${data?.id}/upload`, formData)
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
                <span style={{ fontSize: 22, fontWeight: 'bold' }}>{data?.clinicId ? 'Update' : 'Create'} Clinic</span>
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
