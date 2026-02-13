import React from 'react'
import "./AuthLandingPage.css"
import Login from '../../components/Login'

import back from '../../assets/AuthBackground.jpg';

export default function AuthLandingPage() {
  return (
    <div className="authPageContainer">
      <div className="leftPanel">
        <img src={back} className='backImg'/>
      </div>
      <div className="rightPanel">
        <h1 className='titleAuth'>DocDesk Admin Panel</h1>
        <Login/>
      </div>
    </div>
  )
}
