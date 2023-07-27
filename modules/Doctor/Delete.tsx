import React, { forwardRef, useState } from 'react'
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core'
import { useMutation } from 'react-query'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import { SNACKBAR_OPEN } from '../../store/actions'
import { store } from '../../pages/_app'
import axios from '../../utils/axios'

interface IProps {
    onSuccess?: () => void
}

const DeleteForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { isOpen, open, close } = useOpenState()
    const [id, setId] = useState(null)

    const { mutate, isLoading } = useMutation(() => axios.delete(`/api/doctor/${id}`), {
        onSuccess: () => {
            store.dispatch({
                type: SNACKBAR_OPEN,
                open: true,
                message: 'Doctor has been deleted successfully',
                variant: 'alert',
                alertSeverity: 'success',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
            })

            handleClose()
            onSuccess?.()
        },
    })

    const handleClose = () => {
        setId(null)
        close()
    }

    const handleOpen = (id) => {
        setId(id)
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
        <>
            <Dialog sx={{ '& .MuiDialog-paper': { width: '80%' } }} maxWidth="xs" open={isOpen}>
                <DialogTitle>
                    <span style={{ fontSize: 18, fontWeight: 'bold' }}>Delete</span>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography fontSize={'16px'}> Are you sure to delete?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isLoading}>
                        Close
                    </Button>
                    <Button color={'error' as any} variant="contained" onClick={() => mutate()} disabled={isLoading}>
                        Delete
                        {isLoading && <CircularProgress size={14} style={{ marginLeft: '12px' }} />}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
})

export default DeleteForm
