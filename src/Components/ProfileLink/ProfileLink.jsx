import React from 'react';
import { NavLink } from 'react-router-dom';

import profileIcon from '../../assets/ProfileIcon.png';
import './ProfileLinkStyle.css';

const ProfileLink = () => {
    return (
        <NavLink to='/profile' className='profile'>
            <img src={profileIcon} alt='Profile' />
            <span>Profile</span>
        </NavLink>
    )
}

export default ProfileLink
