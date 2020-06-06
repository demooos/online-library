import React from 'react'
import styled from 'styled-components/macro'
import { setConfig } from 'react-hot-loader'
import { hot } from 'react-hot-loader/root'
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom'

import { compose } from 'redux'
import hooks from 'hooks'
import hoc from 'hoc'

import RouterTransition from 'components/common/RouterTransitions'

import Roles from 'components/Roles'

import Loader from 'components/Loader/Loader'

import Home from 'components/Home/Home'
import UserLogin from 'components/UserLogin/UserLogin'
import UserRegistration from 'components/UserRegistration/UserRegistration'

import { IRoute } from 'components/common/RouterTransitions'

setConfig({
    reloadHooks: false
})

const AppContainer = styled.main`
    height: 100%;
`

const App: React.FC<RouteComponentProps> = ({ location }) => {
    const routes: IRoute[] = [
        {
            order: 0,
            pathname: '/',
            render: () => (
                <Roles.Guest>
                    <Home />
                </Roles.Guest>
            )
        },
        {
            order: 1,
            pathname: '/logowanie',
            render: () => (
                <Roles.Guest>
                    <UserLogin />
                </Roles.Guest>
            )
        },
        {
            order: 1,
            pathname: '/rejestracja',
            render: () => (
                <Roles.Guest>
                    <UserRegistration />
                </Roles.Guest>
            )
        },
        {
            order: 0,
            pathname: '*',
            render: () => <Redirect to="/" />
        }
    ]
    const { isLoading } = hooks.useLoader()
    return (
        <AppContainer>
            {isLoading && <Loader />}
            <RouterTransition routes={routes} location={location.pathname}>
                <Switch location={location}>
                    {routes.map(({ pathname, render }) => (
                        <Route key={pathname} path={pathname} render={render} exact />
                    ))}
                </Switch>
            </RouterTransition>
        </AppContainer>
    )
}

export default process.env.NODE_ENV === 'development'
    ? compose(hoc.withRouter)(hot(App))
    : compose(hoc.withRouter)(App)
