import { FormControl, FormHelperText, makeStyles, TextField } from '@material-ui/core'
import { LocalizationProvider, DatePicker as Picker } from '@material-ui/lab'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import { format } from 'date-fns'
import isValid from 'date-fns/isValid'

const useStyles = makeStyles((theme) => ({
    customeDatePicker: {
        '& [class*="MuiMonthPicker-root-"]': {
            width: '100%',
            '& button': {
                background: 0,
                border: 0,
                height: 50,
                '&:hover': {
                    background: theme.palette.grey[100],
                    borderRadius: 50,
                },
            },
        },
    },
}))

const DatePicker = ({
    label,
    value,
    name,
    onChange,
    isTouched = false,
    error = null,
    onBlur = null,
    inputFormat = 'yyyy-MM-dd',
    mask = '____-__-__',
    ...rest
}) => {
    const classes = useStyles()

    return (
        <FormControl fullWidth error={Boolean(isTouched && error)} variant="outlined" size="small">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Picker
                    label={label}
                    value={value}
                    inputFormat={inputFormat}
                    mask={mask}
                    views={['year', 'month', 'day']}
                    className={classes.customeDatePicker}
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
}

export default DatePicker
