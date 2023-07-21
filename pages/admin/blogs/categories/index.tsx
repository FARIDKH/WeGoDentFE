import React, { useRef } from 'react'

import { Box, Typography } from '@material-ui/core'
import { useQuery } from 'react-query'
import axios from '../../../../utils/axios'
import MainLayout from '../../../../layout/admin/MainLayout'
import MainCard from '../../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../../ui-component/PaginatedTableGenerator'
import CreateButtonFab from '../../../../ui-component/CreateButtonFab'
import CreateEditForm from '../../../../modules/blogs/categories/CreateEdit'
import DeleteForm from '../../../../modules/blogs/categories/Delete'

const BlogCategories = () => {
    const createEditRef = useRef(null)
    const deleteRef = useRef(null)

    const { data, isFetching, isError, refetch } = useQuery(['BlogCategories'], async ({ signal }) => {
        const result = await axios(`/api/blogcategory`, { signal })
        return result.data
    })

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    Blog Categories
                </Typography>

                <MainCard>
                    <Box px={2}>
                        <PaginatedTableGenerator
                            isLoading={isFetching}
                            isError={isError}
                            data={{
                                data,
                            }}
                            columns={[
                                {
                                    id: 'id',
                                    numeric: false,
                                    label: 'ID',
                                    align: 'left',
                                },
                                {
                                    id: 'name',
                                    numeric: false,
                                    label: 'Name',
                                    align: 'left',
                                },
                            ]}
                            actions={[
                                {
                                    label: 'Edit',
                                    onClick: ({ id, name }) =>
                                        createEditRef?.current?.open({
                                            id,
                                            name,
                                        }),
                                },
                                {
                                    label: 'Delete',
                                    onClick: ({ id }) => {
                                        deleteRef?.current?.open(id)
                                    },
                                },
                            ]}
                        />
                    </Box>
                </MainCard>

                <CreateButtonFab onClick={() => createEditRef?.current?.open()} />

                <CreateEditForm ref={createEditRef} onSuccess={refetch} />
                <DeleteForm ref={deleteRef} onSuccess={refetch} />
            </MainLayout>
        </>
    )
}

export default BlogCategories
