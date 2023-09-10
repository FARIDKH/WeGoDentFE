import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@material-ui/core'

import axios from '../../utils/axios'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import FolderIcon from '@mui/icons-material/Folder'
import DeleteIcon from '@mui/icons-material/Delete'

import { Formik } from 'formik'
import React from 'react'
import { forwardRef, useState } from 'react'
import { useMutation } from 'react-query'
import useUser from '../../lib/useUser'
import { store } from '../../pages/_app'
import { SNACKBAR_OPEN } from '../../store/actions'
import Input from '../../ui-component/Form/Input'
import { useOpenState } from '../../ui-component/hooks/useOpenState'
import { useQuery } from 'react-query'
// import Autocomplete from '../Autocomplete'

interface IProps {
    onSuccess?: () => void
}

const CreateEditPhaseForm = forwardRef(({ onSuccess }: IProps, ref) => {
    const { user } = useUser()
    const { isOpen, open, close } = useOpenState()
    const [data, setData] = useState(null)

    const [dense, setDense] = React.useState(false)
    const [secondary, setSecondary] = React.useState(false)
    // function generate(id: number, element: React.ReactElement) {

    // const { data : phases } = useQuery(['Phases'], async ({ signal }) => {
    //     const result = await axios(`/api/treatment/${id}/phase`, { signal })
    //     return result.data
    // })

    //     if( id != null ){
    //         console.log(data)
    //         return [0, 1, 2,3 ].map((value) =>
    //             React.cloneElement(element, {
    //                 key: value,
    //             }),
    //         );
    //     }
    //     return []

    // }

    const { isLoading, mutate } = useMutation((values: any) => axios.post(`/api/treatment/${data?.id}/phase`, values), {
        onSuccess: () => {
            store.dispatch({
                type: SNACKBAR_OPEN,
                open: true,
                message: 'Phase has been updated successfully',
                variant: 'alert',
                alertSeverity: 'success',
                anchorOrigin: { vertical: 'top', horizontal: 'center' },
            })

            // handleClose()
            onSuccess()
        },
    })

    const handleClose = () => {
        setData(null)
        close()
    }

    const handleOpen = (data = null) => {
        data && setData(data)
        open()
    }

    const handleDelete = async (treatmentId, phaseId) => {
        const result = await axios.delete(`/api/treatment/${treatmentId}/phase/${phaseId}`)
        store.dispatch({
            type: SNACKBAR_OPEN,
            open: true,
            message: 'Phase has been deleted successfully',
            variant: 'alert',
            alertSeverity: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
        })
        onSuccess()
    }

    React.useImperativeHandle(
        ref,
        () => ({
            open: handleOpen,
        }),
        []
    )
    const Demo = styled('div')(({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
    }))

    return (
        <Dialog sx={{ '& .MuiDialog-paper': { width: '30rem', maxHeight: 600 } }} maxWidth="lg" open={isOpen}>
            <Formik
                initialValues={{
                    name: '',
                    description: '',
                }}
                onSubmit={(values) => mutate(values)}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <DialogTitle>
                            <span style={{ fontSize: 22, fontWeight: 'bold' }}>Create Phase</span>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid item xs={12} md={1}>
                                <Typography sx={{ mt: 1, mb: 2 }} variant="h6" component="div">
                                    List of phases
                                </Typography>
                                <Demo>
                                    <List dense={dense}>
                                        {data?.treatmentPhaseList.map((value) => (
                                            <ListItem
                                                key={value}
                                                secondaryAction={
                                                    <IconButton
                                                        edge="end"
                                                        onClick={() => handleDelete(data?.id, value?.id)}
                                                        aria-label="delete"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemText primary={`${value?.name}`} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Demo>
                            </Grid>
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
                                label="description"
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

export default CreateEditPhaseForm
