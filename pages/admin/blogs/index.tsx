import React, { useRef } from 'react'

import { Box, Typography } from '@material-ui/core'
import { useQuery } from 'react-query'
import axios from '../../../utils/axios'
import MainLayout from '../../../layout/admin/MainLayout'
import MainCard from '../../../ui-component/cards/MainCard'
import PaginatedTableGenerator from '../../../ui-component/PaginatedTableGenerator'
import CreateButtonFab from '../../../ui-component/CreateButtonFab'
import CreateEditForm from '../../../modules/blogs/CreateEdit'
import DeleteForm from '../../../modules/blogs/Delete'
import { trimString } from '../../../utils/string'

const Blogs = () => {
    const createEditRef = useRef(null)
    const deleteRef = useRef(null)

    const { data, isFetching, isError, refetch } = useQuery(['Blogs'], async ({ signal }) => {
        const result = await axios(`/api/blogposts`, { signal })
        return result.data
    })

    return (
        <>
            <MainLayout>
                <Typography variant="h1" mb={2}>
                    Blogs
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
                                    id: 'authorId',
                                    numeric: false,
                                    label: 'Author ID',
                                    align: 'left',
                                },
                                {
                                    id: 'title',
                                    numeric: false,
                                    label: 'Title',
                                    align: 'left',
                                },
                                {
                                    id: 'categories',
                                    numeric: false,
                                    label: 'Cateogies',
                                    align: 'left',
                                    renderAs: ({ blogCategoryDTOS }) => blogCategoryDTOS?.map(({ name }) => name)?.toString(),
                                },
                                {
                                    id: 'content',
                                    numeric: false,
                                    label: 'Content',
                                    align: 'left',
                                    renderAs: ({ content }) => trimString(content, 50),
                                },
                            ]}
                            actions={[
                                {
                                    label: 'Edit',
                                    onClick: (blog) => createEditRef?.current?.open(blog),
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

export default Blogs
