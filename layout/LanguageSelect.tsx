import { Box, MenuItem, Select, SelectChangeEvent, SelectProps } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React from 'react'
import { IconFlagUK } from 'material-ui-flags'

interface IProps {
    selectProps?: SelectProps
}

const LanguagaSelect = ({ selectProps }: IProps) => {
    const router = useRouter()

    const [language, setLanguage] = React.useState(router?.locale ?? 'en')

    const { i18n } = useTranslation('common')

    const changeLanguage = (lng: string) => {
        i18n?.changeLanguage(lng)?.then(() => {
            router.push(router.asPath, undefined, { locale: lng })
        })
    }

    // eslint-disable-next-line no-undef
    const handleChange = (event: SelectChangeEvent) => {
        setLanguage(event.target.value as string)
        changeLanguage(event.target.value as string)
    }

    const { sx, ...restSelectProps } = selectProps ?? {}

    return (
        <Box sx={{ width: 100, height: 50 }}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // label="Language"
                value={language}
                sx={{
                    height: '50px',
                    background: 'none ',
                    border: '1px solid white',
                    '& div': {
                        background: 'none',
                        color: {
                            xl: 'black',
                            sm: 'white',
                        },
                    },
                    '& .MuiSvgIcon-root': {
                        fill: {
                            xl: 'black',
                            sm: 'white',
                        },
                    },
                    ...sx,
                }}
                {...restSelectProps}
                onChange={handleChange}
                MenuProps={{
                    sx: {
                        '& .Mui-selected': {
                            backgroundColor: 'pink',
                        },
                    },
                }}
            >
                <MenuItem value={'en'}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <IconFlagUK sx={{ marginRight: '15px' }} />
                        <div>EN</div>
                    </Box>
                </MenuItem>
                <MenuItem value={'hu'}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <svg
                            style={{ marginRight: '15px' }}
                            width={'25px'}
                            xmlns="http://www.w3.org/2000/svg"
                            id="flag-icons-hu"
                            viewBox="0 0 640 480"
                        >
                            <g fillRule="evenodd">
                                <path fill="#fff" d="M640 480H0V0h640z" />
                                <path fill="#388d00" d="M640 480H0V320h640z" />
                                <path fill="#d43516" d="M640 160.1H0V.1h640z" />
                            </g>
                        </svg>
                        <div>HU</div>
                    </Box>
                </MenuItem>
            </Select>
        </Box>
    )
}

export default LanguagaSelect
