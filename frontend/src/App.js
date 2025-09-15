import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Stores from './pages/Stores';

export default function App(){
  return (<div style={{padding:20}}>
    <nav><Link to='/'>Stores</Link> | <Link to='/login'>Login</Link> | <Link to='/signup'>Signup</Link></nav>
    <Routes>
      <Route path='/' element={<Stores/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/signup' element={<Signup/>} />
    </Routes>
  </div>);
}
