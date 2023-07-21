import { FormControl, FormHelperText, TextField } from '@material-ui/core'
import { LocalizationProvider, DateTimePicker as Picker } from '@material-ui/lab'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import { format, isValid } from 'date-fns'

const DateTimePicker = ({
    label,
    value,
    name,
    onChange,
    isTouched,
    error,
    onBlur,
    inputFormat = 'yyyy-MM-dd HH:mm',
    mask = '____-__-__ __:__',
    ...rest
}) => (
    <FormControl fullWidth error={Boolean(isTouched && error)} variant="outlined" size="small">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Picker
                label={label}
                value={value}
                inputFormat={inputFormat}
                mask={mask}
                {...rest}
                onChange={(val) => {
                    onChange(!val || !isValid(val) ? '' : format(new Date(val), inputFormat))
                }}
                renderInput={(params) => (
                    <TextField size="small" fullWidth onBlur={onBlur} name={name} {...params} error={Boolean(isTouched && error)} />
                )}
            />
        </LocalizationProvider>
        <FormHelperText error style={{ minHeight: '18px' }}>
            {isTouched && error}
        </FormHelperText>
    </FormControl>
)

export default DateTimePicker
