import { Button, ButtonProps } from '@material-ui/core'
import useUser from '../../lib/useUser'
import IconPerson from '@material-ui/icons/Person'

const LoginButton = (props?: ButtonProps) => {
    const { isLoggedIn } = useUser(false)
    const { sx, ...restProps } = props ?? {}

    return (
        <Button
            sx={{
                height: '90%',
                borderRadius: '12px',
                ...sx,
            }}
            disableElevation
            LinkComponent="a"
            variant="contained"
            color="secondary"
            startIcon={<IconPerson />}
            href={isLoggedIn ? '/admin/dashboard' : '/admin/login'}
            {...restProps}
        >
            {isLoggedIn ? 'Dashboard' : 'Login'}
        </Button>
    )
}

export default LoginButton
