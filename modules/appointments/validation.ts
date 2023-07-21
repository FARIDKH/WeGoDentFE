import * as yup from 'yup'

export const categoryValidationSchema = yup.object({
    name: yup.string().trim().required('Field is required'),
})

export const blogValidationSchema = yup.object({
    title: yup.string().trim().required('Field is required'),
    content: yup.string().trim().required('Field is required'),
    blogCategoryDTOS: yup
        .array()
        .of(
            yup.object({
                id: yup.number(),
                name: yup.string(),
            })
        )
        .min(1, 'Field is required'),
})
