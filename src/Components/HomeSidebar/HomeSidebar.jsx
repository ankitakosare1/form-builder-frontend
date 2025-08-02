import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import './HomeSidebarStyle.css';

import homeIcon from '../../assets/HomeIcon.png';
import analysisIcon from '../../assets/AnalysisIcon.png';
import projectsIcon from '../../assets/ProjectsIcon.png';

import SidebarHeader from '../../Components/SidebarHeader/SidebarHeader';
import ProfileLink from '../../Components/ProfileLink/ProfileLink';

const HomeSidebar = ({ customClass = "" }) => {
    const [hovered, setHovered] = useState(null);

    return (
        <aside className={`sidebar ${customClass}`}>
            <nav className='home-sidebar'>
                <SidebarHeader />

                <NavLink to='/home'
                    className={({ isActive }) => `nav-link ${isActive && !hovered ? 'active' : ''}`}>
                    <img src={homeIcon} alt='Home' />
                    <span>Home</span>
                </NavLink>

                <NavLink to='/analysis'
                    className={({ isActive }) => `nav-link ${hovered === 'analysis' ? 'hovered' : isActive ? 'active' : ''}`}
                    onMouseEnter={() => setHovered('analysis')}
                    onMouseLeave={() => setHovered(null)}
                >
                    <img src={analysisIcon} alt='Analysis' />
                    <span>Analysis</span>
                </NavLink>

                <NavLink to='/projects'
                    className={({ isActive }) => `nav-link ${hovered === 'projects' ? 'hovered' : isActive ? 'active' : ''}`}
                    onMouseEnter={() => setHovered('projects')}
                    onMouseLeave={() => setHovered(null)}
                >
                    <img src={projectsIcon} alt='Projects' />
                    <span>Projects</span>
                </NavLink>
            </nav>

            <ProfileLink />
        </aside>
    );
};


export default HomeSidebar;
