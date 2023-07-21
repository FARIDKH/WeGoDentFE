import React from 'react'
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'

const PasswordInput = ({ id, label, name, isTouched = null, error = null, onBlur, onChange, disabled = false, value, ...props }) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault()
    }

    return (
        <FormControl fullWidth error={Boolean(isTouched && error)} variant="outlined" className={props?.classNames?.formControl}>
            <InputLabel htmlFor={id}>{label}</InputLabel>
            <OutlinedInput
                id={id}
                type={showPassword ? 'text' : 'password'}
                value={value}
                name={name}
                onBlur={onBlur}
                onChange={onChange}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                }
                label={label}
                disabled={disabled}
            />
            <FormHelperText error={Boolean(isTouched && error)} id={`${id}-helper-text`} style={{ minHeight: '18px' }}>
                {isTouched && error}
            </FormHelperText>
        </FormControl>
    )
}

export default PasswordInput
