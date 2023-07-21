import React from 'react'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import Autocomplete from '../Autocomplete'

interface IProps {
    name: string
    value: any
    onChange: any
    disabled?: boolean
    isLoading: boolean
    isTouched?: boolean
    onBlur: any
    error: string
    [key: string]: any
}

const BlogCategorySelect = ({
    label = 'Category',
    id = 'blogCategory',
    name,
    onChange,
    disabled,
    error,
    value,
    isLoading,
    isTouched,
    onBlur,
    ...rest
}: IProps) => {
    const { data, isFetching } = useQuery(
        ['BlogCategories'],
        async ({ signal }) => {
            const result = await axios(`/api/blogcategory`, { signal })
            return result.data
        },
        {
            initialData: [],
        }
    )

    console.log('error', error)

    return (
        <Autocomplete
            id={id}
            multiple
            name={name}
            value={value}
            onBlur={onBlur}
            onChange={(e, value: any) => {
                onChange(value)
            }}
            label={isFetching ? 'Loading..' : label}
            isTouched={isTouched}
            error={error}
            disabled={isFetching || disabled}
            getOptionLabel={(option) => option?.name}
            getOptionSelected={(option, value) => option?.id === value?.id}
            data={data}
            loading={isLoading || isFetching}
            {...rest}
        />
    )
}

export default BlogCategorySelect
