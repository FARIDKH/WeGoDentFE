import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { Formik, Form } from 'formik';
import ClinicSelect from "../../ui-component/Form/selects/ClinicSelect"

interface IProps {
    onSuccess?: (clinicId: string) => void,
    onClose?: () => void
}

const ClinicSelectionModal = forwardRef(({ onSuccess, onClose }: IProps, ref) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose();
    };

    const handleConfirm = (values) => {
        if (onSuccess) onSuccess(values.clinicId);
        handleClose();
    };

    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Select a Clinic</DialogTitle>
            <Formik
                initialValues={{
                    clinicId: ''
                }}
                onSubmit={handleConfirm}
            >
                {({ errors, handleBlur, handleChange, touched, values }) => (
                    <Form>
                        <DialogContent>
                            <ClinicSelect
                                fetch={open}
                                name="clinicId"
                                isTouched={!!touched.clinicId}
                                error={errors?.clinicId as string}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values?.clinicId}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit" color="primary">Confirm</Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
});

export default ClinicSelectionModal;
