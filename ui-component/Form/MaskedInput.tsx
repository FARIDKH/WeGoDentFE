import React from 'react'
import InputMask from 'react-input-mask'
import { FormControl, InputLabel, OutlinedInput, FormHelperText } from '@material-ui/core'

const MaskedInput = ({ id, mask, label, name, isTouched = null, error = null, onBlur, onChange, disabled = false, value, ...props }) => (
    <InputMask mask={mask} value={value} onBlur={onBlur} onChange={onChange}>
        {() => (
            <FormControl fullWidth error={Boolean(isTouched && error)} variant="outlined" size="small">
                <InputLabel htmlFor={id}>{label}</InputLabel>
                <OutlinedInput id={id} label={label} disabled={disabled} size="small" name={name} {...props} />
                <FormHelperText error id={`${id}-helper-text`} style={{ minHeight: '18px' }}>
                    {isTouched && error}
                </FormHelperText>
            </FormControl>
        )}
    </InputMask>
)

export default MaskedInput
