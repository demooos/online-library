import { Guest, User } from 'components/shared/roles'

import Home from 'components/guest/Home/Home'
import Registration from 'components/guest/Registration/Registration'
import Support from 'components/guest/Support/Support'
import Authentication from 'components/guest/Authentication/Authentication'
import Login from 'components/guest/Login/Login'
import PasswordRecovery from 'components/guest/PasswordRecovery/PasswordRecovery'

import Store from 'components/user/Store/Store'
import Profile from 'components/user/Profile/Profile'
import Cart from 'components/user/Cart/Cart'
import Chat from 'components/user/Chat/Chat'

export const HomeRoute = () => (
    <Guest>
        <Home />
    </Guest>
)

export const RegistrationRoute = () => (
    <Guest>
        <Registration />
    </Guest>
)

export const EmailSupportRoute = () => (
    <Guest>
        <Support />
    </Guest>
)

export const AuthenticationRoute = () => (
    <Guest>
        <Authentication />
    </Guest>
)

export const LoginRoute = () => (
    <Guest>
        <Login />
    </Guest>
)

export const PasswordSupportRoute = () => (
    <Guest>
        <Support withPasswordSupport />
    </Guest>
)

export const PasswordRecoveryRoute = () => (
    <Guest>
        <PasswordRecovery />
    </Guest>
)

export const StoreRoute = () => (
    <User>
        <Store />
    </User>
)

export const ProfileRoute = () => (
    <User>
        <Profile />
    </User>
)

export const CartRoute = () => (
    <User>
        <Cart />
    </User>
)

export const ChatRoute = () => (
    <User>
        <Chat />
    </User>
)
