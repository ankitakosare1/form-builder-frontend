import React from 'react';
import { NavLink } from 'react-router-dom';

import canovaLogo from '../../assets/Canova_Logo.png';
import './SidebarHeaderStyle.css';

const SidebarHeader = () => {
    return (
        <div className='sidebar-header'>
            <NavLink to='/home' className='logo-link'>
                <img src={canovaLogo} alt='CANOVA Logo' className='logo' />
                <span className='logo-text'>CANOVA</span>
            </NavLink>
        </div>
    )
}

export default SidebarHeader
