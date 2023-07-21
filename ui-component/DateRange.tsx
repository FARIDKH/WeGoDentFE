/* eslint-disable no-unused-vars */
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@material-ui/core'
import { add, format, isValid } from 'date-fns'
import React, { useEffect } from 'react'
import DatePicker from './Form/DatePicker'

const dateSelect = [
    {
        label: 'Current Day',
        dateFrom: new Date(),
    },
    {
        label: 'Last week',
        dateFrom: add(new Date(), { weeks: -1 }),
    },
    {
        label: 'Last 10 days',
        dateFrom: add(new Date(), { days: -10 }),
    },
    {
        label: 'Last month',
        dateFrom: add(new Date(), { months: -1 }),
    },
]

interface IDateRange {
    nameFrom?: string
    nameTo?: string
    dateFrom: string
    dateTo: string
    onDateFromChange: (val) => void
    onDateToChange: (val) => void
    onDateRangeChange?: (from, to) => void
    size?: 'small' | 'medium'
    direction?: 'column' | 'row'
    showPeriods?: boolean
    [key: string]: any
}

const DateRange = ({
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    onDateRangeChange,
    nameFrom = 'dateFrom',
    nameTo = 'dateTo',
    showPeriods = true,
    size = 'small',
    direction = 'row',
    labelFrom = 'From',
    labelTo = 'To',
    ...rest
}: IDateRange) => {
    const [datePeriod, setDatePeriod] = React.useState('')
    const gridSize = showPeriods ? 4 : 6

    useEffect(() => {
        !dateFrom && !dateTo && setDatePeriod('')
    }, [dateFrom, dateTo])

    return (
        <Grid container spacing={2} direction={direction}>
            <Grid item xs={6} sm={gridSize} md={gridSize}>
                <DatePicker
                    label={labelFrom}
                    name={nameFrom}
                    value={dateFrom}
                    maxDate={dateTo || new Date()}
                    onChange={(val) => {
                        onDateFromChange(val)
                        setDatePeriod('')
                    }}
                    isTouched={rest?.touched?.[nameFrom]}
                    error={rest?.errors?.[nameFrom]}
                    onBlur={rest?.handleBlur}
                    disabled={rest?.disabled}
                />
            </Grid>
            <Grid item xs={6} sm={gridSize} md={gridSize}>
                <DatePicker
                    label={labelTo}
                    name={nameTo}
                    value={dateTo}
                    minDate={dateFrom || undefined}
                    maxDate={new Date()}
                    onChange={(val) => {
                        onDateToChange(val)
                        setDatePeriod('')
                    }}
                    isTouched={rest?.touched?.[nameTo]}
                    error={rest?.errors?.[nameTo]}
                    onBlur={rest?.handleBlur}
                    disabled={rest?.disabled}
                />
            </Grid>
            {showPeriods && (
                <Grid item xs={12} sm={4} md={4}>
                    <FormControl fullWidth variant="outlined" size={size}>
                        <InputLabel>Select period</InputLabel>
                        <Select
                            fullWidth
                            size={size}
                            value={datePeriod}
                            label="Select period"
                            onChange={(v) => setDatePeriod(v.target.value)}
                            disabled={rest?.disabled}
                        >
                            {dateSelect.map(({ label, dateFrom: val }) => (
                                <MenuItem
                                    key={label}
                                    value={label}
                                    selected={label === datePeriod}
                                    onClick={() => {
                                        if (onDateRangeChange)
                                            onDateRangeChange(format(val, 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd'))
                                        else {
                                            onDateFromChange(format(val, 'yyyy-MM-dd'))
                                            onDateToChange(format(new Date(), 'yyyy-MM-dd'))
                                        }
                                    }}
                                >
                                    {label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            )}
        </Grid>
    )
}

export default DateRange
