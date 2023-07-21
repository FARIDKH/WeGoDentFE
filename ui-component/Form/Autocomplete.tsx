import { Autocomplete as MUIAutocomplete, FormControl, TextField, FormHelperText } from '@material-ui/core'

const Autocomplete = ({
    id,
    name,
    label,
    value,
    data,
    onBlur,
    onChange,
    isTouched = null,
    error = null,
    getOptionSelected,
    getOptionLabel,
    helperText = null,
    customInputProps = {},
    ...rest
}) => (
    <FormControl fullWidth error={Boolean(isTouched && error)} variant="outlined" size="small">
        <MUIAutocomplete
            id={id}
            value={value}
            options={data}
            fullWidth
            onChange={onChange}
            getOptionLabel={getOptionLabel}
            getOptionSelected={getOptionSelected}
            size="small"
            {...rest}
            renderInput={(params) => (
                <TextField
                    error={Boolean(isTouched && error)}
                    {...params}
                    {...customInputProps}
                    name={name}
                    onBlur={onBlur}
                    size="small"
                    label={label}
                    variant="outlined"
                />
            )}
        />
        <FormHelperText error={Boolean(isTouched && error)} id={`${id}-helper-text`} style={{ minHeight: '18px' }}>
            {(isTouched && error) || helperText}
        </FormHelperText>
    </FormControl>
)

export default Autocomplete
