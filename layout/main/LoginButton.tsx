import { Button, ButtonProps } from '@material-ui/core'
import useUser from '../../lib/useUser'
import IconPerson from '@material-ui/icons/Person'
import IconHome from '@material-ui/icons/Home'

const LoginButton = (props?: ButtonProps) => {
    const { isLoggedIn } = useUser(false)

    return (
        <Button
            sx={{
                height: '90%',
            }}
            disableElevation
            LinkComponent="a"
            variant="contained"
            color="secondary"
            startIcon={isLoggedIn ? <IconHome /> : <IconPerson />}
            href={isLoggedIn ? '/admin/dashboard' : '/admin/login'}
            {...props}
        >
            {isLoggedIn ? 'Dashboard' : 'Login'}
        </Button>
    )
}

export default LoginButton
