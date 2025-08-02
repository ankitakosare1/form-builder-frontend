import React from 'react'
import './PageTitleStyle.css'

const PageTitle = ({title}) => {
  return (
    <p className='page-title'>
      {title}
    </p>
  )
}

export default PageTitle;
