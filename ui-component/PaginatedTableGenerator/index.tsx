import React from 'react'
import { Table, TableContainer, TableCell, TableHead, TableRow, TableBody, TableSortLabel, Box, Typography } from '@material-ui/core'

import { useRouter } from 'next/router'

import Pagination from '@material-ui/core/Pagination'
import PaginationItem from '@material-ui/core/PaginationItem'

import Link from './../LinkRef'
import { excludeQueryParams } from '../../utils/query'

import { IAction } from './MenuDropdown'
import Loading from '../Loading'
import ErrorIcon from './ErrorIcon'

import Row from './TableRow'
import NoResult from '../NoResult'

interface IColumn {
    id: string
    label: string
    align: 'left' | 'right' | 'inherit' | 'center' | 'justify'
    disablePadding?: boolean
    numeric: boolean
    // eslint-disable-next-line no-unused-vars
    renderAs?: (row: any) => React.ReactNode
    sort?: boolean
    width?: number
    nonClickable?: boolean
    hide?: boolean
}

interface IProps {
    columns: IColumn[]
    data: {
        pageNumber?: number
        totalPages?: number
        pageSize?: number
        data: any[]
        totalCount?: number
    }
    // eslint-disable-next-line no-unused-vars
    rowStyle?: (row) => React.CSSProperties
    // eslint-disable-next-line no-unused-vars
    onRowClick?: (row) => void
    // eslint-disable-next-line no-unused-vars
    collapse?: (row: any) => React.ReactNode
    excludedQueryList?: string[]
    // eslint-disable-next-line no-unused-vars
    actions?: IAction[] | ((row) => IAction[])
    isLoading: boolean
    isError: boolean
    hideHead?: boolean
    pagination?: boolean
    sortable?: boolean
    // eslint-disable-next-line no-unused-vars
    onRightClick?: (row) => string | false | null
}

const PaginatedTableGenerator: React.FC<IProps> = ({
    columns,
    collapse,
    data,
    rowStyle,
    onRowClick,
    excludedQueryList = [],
    actions,
    isLoading,
    isError,
    hideHead = false,
    pagination = false,
    sortable = true,
    onRightClick,
}) => {
    const router: any = useRouter()
    const isEmpty = data?.data?.length === 0

    const handleSort = (id) => {
        const sortBy = id
        const sort = router.query?.sort?.endsWith(`,asc`) ? 'desc' : 'asc'
        const path = router.asPath.split('?')[0]

        const query = {
            ...excludeQueryParams(router.query, excludedQueryList),
            page: '0',
            sort: `${sortBy},${sort}`,
        }

        router.push(`${path}?${new URLSearchParams(query).toString()}`)
    }

    const renderState = (children) => (
        <TableRow>
            <TableCell colSpan={columns.length + Number(Boolean(actions)) + Number(Boolean(collapse))}>{children}</TableCell>
        </TableRow>
    )

    const isLastPage = data?.pageNumber + 1 == data?.totalPages
    const from = isLastPage ? data?.totalCount - data?.pageSize + 1 : data?.pageNumber * data?.pageSize + 1
    const to = isLastPage ? data?.totalCount : (data?.pageNumber + 1) * data?.pageSize

    return (
        <>
            <TableContainer>
                <Table>
                    {!hideHead && (
                        <TableHead>
                            <TableRow>
                                {columns.map(
                                    ({ sort = false, hide = false, ...headCell }) =>
                                        !hide &&
                                        headCell && (
                                            <TableCell
                                                key={headCell.id}
                                                align={headCell.align}
                                                padding={headCell.disablePadding ? 'none' : 'normal'}
                                                sx={{
                                                    minWidth: 20,
                                                    '&:not(.MuiTableCell-paddingNone)': { padding: '16px 8px' },
                                                }}
                                            >
                                                {sort === false || !sortable ? (
                                                    headCell.label
                                                ) : (
                                                    <TableSortLabel
                                                        active={router.query?.sort?.startsWith(`${headCell.id},`)}
                                                        direction={router.query?.sort?.endsWith(`,asc`) ? 'asc' : 'desc'}
                                                        onClick={() => handleSort(headCell.id)}
                                                    >
                                                        {headCell.label}
                                                    </TableSortLabel>
                                                )}
                                            </TableCell>
                                        )
                                )}
                                {!!collapse && <TableCell />}
                                {actions && <TableCell />}
                            </TableRow>
                        </TableHead>
                    )}

                    <TableBody>
                        {isLoading &&
                            !isEmpty &&
                            renderState(
                                <Box textAlign="center" py={5}>
                                    <Loading size={65} />
                                </Box>
                            )}
                        {isEmpty && !isLoading && !isError && renderState(<NoResult />)}
                        {isError &&
                            !isEmpty &&
                            !isLoading &&
                            renderState(
                                <Box textAlign="center">
                                    <Box py={4}>
                                        <ErrorIcon />
                                    </Box>
                                    <Typography fontSize="16px"> Unexpected error occured</Typography>
                                </Box>
                            )}
                        {!isLoading && !isError && !isEmpty && (
                            <>
                                {data?.data?.map((row, index) => (
                                    <Row
                                        key={index}
                                        columns={columns}
                                        row={row}
                                        rowStyle={rowStyle}
                                        onRowClick={onRowClick}
                                        collapse={collapse?.(row) ? collapse : false}
                                        actions={actions}
                                        onRightClick={onRightClick}
                                    />
                                ))}
                                {!!data?.totalCount &&
                                    pagination &&
                                    renderState(
                                        <Box textAlign="right">
                                            <i>
                                                Showing {from}-{to} results out of {data?.totalCount}
                                            </i>
                                        </Box>
                                    )}
                            </>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {pagination && !isEmpty && !isLoading && !isError && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                        marginTop: '16px',
                        flexDirection: { md: 'row', sm: 'row', xs: 'column' },
                    }}
                >
                    <Pagination
                        page={data?.pageNumber + 1 || 0}
                        count={data?.totalPages || 0}
                        variant="outlined"
                        shape="rounded"
                        siblingCount={0}
                        renderItem={(item) => (
                            <PaginationItem
                                component={Link}
                                href={{
                                    pathname: router.pathname,
                                    query: {
                                        ...router.query,
                                        page: item.page - 1,
                                    },
                                }}
                                {...item}
                            />
                        )}
                    />
                </Box>
            )}
        </>
    )
}

export default PaginatedTableGenerator
