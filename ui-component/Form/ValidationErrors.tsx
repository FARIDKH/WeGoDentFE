import { Alert, AlertTitle } from '@material-ui/core'

const ValidationErrors = ({ message, validations = null }: { message: string; validations?: Array<{ field: string; error: string }> }) => {
    if (!validations) return <></>

    return (
        <Alert icon={false} severity="error">
            <AlertTitle>{message}</AlertTitle>

            <ul>
                {validations?.map(({ error }, key) => {
                    const fieldName = error.split(' ')[0]
                    const errDescription = error.replace(fieldName, '')
                    return (
                        <li key={key}>
                            <b style={{ textTransform: 'capitalize' }}>{fieldName}</b> {errDescription}
                        </li>
                    )
                })}
            </ul>
        </Alert>
    )
}

export default ValidationErrors
