import { FormControl, InputLabel, OutlinedInput, FormHelperText } from '@material-ui/core'
import React from 'react'

const Input = ({
    id,
    label = null,
    name,
    isTouched = null,
    error = null,
    onBlur = null,
    onChange,
    disabled = false,
    value,
    type = 'text',
    size = 'small',
    classNames = { formControl: '' },
    helperText = null,
    ...props
}) => (
    <FormControl fullWidth error={Boolean(isTouched && error)} variant="outlined" size={size as any} className={classNames?.formControl}>
        {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
        <OutlinedInput
            id={id}
            type={type}
            value={value}
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            disabled={disabled}
            size={size as any}
            label={label}
            {...props}
        />
        <FormHelperText error={Boolean(isTouched && error)} id={`${id}-helper-text`} style={{ minHeight: '18px' }}>
            {(isTouched && error) || helperText}
        </FormHelperText>
    </FormControl>
)

export default Input
