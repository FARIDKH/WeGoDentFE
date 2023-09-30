import { FormControl, InputLabel, OutlinedInput, FormHelperText } from '@material-ui/core'
import React from 'react'

interface InputProps {
    id: string;
    label?: string;
    name: string;
    isTouched?: any ;
    error?: any ;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    value?: string | number;  // <-- make this optional
    type?: string;
    size?: string;
    classNames?: {
        formControl?: string;
    };
    helperText?: string | null;
    [x: string]: any;  // this line allows extra properties
}

const Input: React.FC<InputProps> = ({
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
            {...(type !== 'file' ? { value } : {})}
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
