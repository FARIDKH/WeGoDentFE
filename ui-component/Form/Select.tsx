import { FormControl, InputLabel, Select as MUISelect, FormHelperText, MenuItem, IconButton } from '@material-ui/core'
import React from 'react'

import ClearIcon from '@material-ui/icons/Clear'

const Select = ({
    id,
    label,
    name,
    isTouched = null,
    error = null,
    onBlur = null,
    onChange,
    disabled = false,
    value,
    data,
    size = 'small',
    noOptionsText = 'No option',
    isClearable = false,
    onClear = null,
}) => (
    <FormControl fullWidth error={Boolean(isTouched && error)} variant="outlined" size={size as any}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <MUISelect
            id={id}
            size={size as any}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            label={label}
            disabled={disabled}
            displayEmpty
            name={name}
            style={{ textTransform: 'capitalize' }}
            sx={{
                '& .MuiSelect-iconOutlined': { display: isClearable && value ? 'none' : 'block' },
            }}
            endAdornment={
                isClearable &&
                value && (
                    <IconButton size="small" sx={{ visibility: value ? 'visible' : 'hidden' }} onClick={onClear}>
                        <ClearIcon fontSize="small" />
                    </IconButton>
                )
            }
        >
            {data.map((item) => (
                <MenuItem key={item.value} value={item.value} style={{ textTransform: 'capitalize' }}>
                    {item.label}
                </MenuItem>
            ))}
            {data?.length == 0 && (
                <MenuItem style={{ textTransform: 'capitalize' }} disabled>
                    {noOptionsText}
                </MenuItem>
            )}
        </MUISelect>
        <FormHelperText error id={`${id}-helper-text`} style={{ minHeight: '18px' }}>
            {isTouched && error}
        </FormHelperText>
    </FormControl>
)

export default Select
