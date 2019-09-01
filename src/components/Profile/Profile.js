import React, { useLayoutEffect } from 'react'
import styled from 'styled-components'
import getCookie from '../../resources/helpers/getCookie'

import MainBackground from '../../assets/img/MainBackground.jpg'
import Navbar from '../../sharedComponents/Navbar/Navbar'
import ProfileBooks from './ProfileBooks'

const ProfileWrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${MainBackground}) center center no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
`;

const Profile = props => {
    useLayoutEffect(() => {
        if (!getCookie('token')) props.history.push('/login')
    }, [])
    return (
        <ProfileWrapper>
            <Navbar profile />
            <ProfileBooks />
        </ProfileWrapper>
    )
}

export default Profile