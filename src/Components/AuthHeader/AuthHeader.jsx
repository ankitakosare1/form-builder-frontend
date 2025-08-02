import React from 'react'
import './AuthHeaderStyle.css'
import logo from "../../assets/Canova_Logo.png"

const AuthHeader = () => {
  return (
    <header className='auth-header'>
        <img src={logo} alt='CANOVA logo' className='auth-logo-icon' />
        <h1 className='auth-logo-text'>CANOVA</h1>
    </header>
  )
}

export default AuthHeader;
