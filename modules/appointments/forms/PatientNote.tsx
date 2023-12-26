import { Box, Grid, Button } from '@material-ui/core'
import * as yup from 'yup'
import { useFormik } from 'formik'
import AnimateButton from '../../../ui-component/extended/AnimateButton'
import Input from '../../../ui-component/Form/Input'

const PatientNoteForm = ({ onSuccess }) => {
    const { errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values } = useFormik({
        initialValues: {
            patientNote: '',
        },
        validationSchema: yup.object().shape({
            patientNote: yup.string().required('Please enter your note'),
        }),
        onSubmit: async (values) => {
            onSuccess?.(values?.patientNote)
        },
    })

    return (
        <Box>
            <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Input
                            id="patientNote"
                            value={values.patientNote}
                            name="patientNote"
                            size="medium"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            label="Note"
                            error={errors?.patientNote}
                            isTouched={touched?.patientNote}
                            multiline
                            rows={3}
                        />
                    </Grid>

                    <Grid item xs={12} mt={1} display="flex" alignItems="center" justifyContent="center">
                        <AnimateButton>
                            <Button
                                disableElevation
                                disabled={isSubmitting}
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                Submit
                            </Button>
                        </AnimateButton>
                    </Grid>
                </Grid>
            </form>
        </Box>
    )
}

export default PatientNoteForm
