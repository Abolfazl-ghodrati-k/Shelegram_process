import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Login from './Login/Login'
import SignUp from './Login/SignUp'
import PrivateRoutes from './PrivateRoutes'
import Home from '../Home'

function Views() {
  return (
   <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/register' element={<SignUp />}/>
      <Route element={<PrivateRoutes />}>
        <Route path='/home' element={<Home />} />
      </Route>
      <Route path='*' element={<Login />}/>
   </Routes>
  )
}

export default Views