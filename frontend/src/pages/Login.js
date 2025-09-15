import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
export default function Login(){
  const [email,setEmail]=useState(''), [password,setPassword]=useState('');
  const nav = useNavigate();
  async function submit(e){
    e.preventDefault();
    try{
      const res = await API.post('/auth/login',{ email, password });
      localStorage.setItem('token', res.data.token);
      alert('Logged in');
      nav('/');
    }catch(e){ alert(e.response?.data?.error || e.message) }
  }
  return (<form onSubmit={submit} style={{maxWidth:400}}>
    <h3>Login</h3>
    <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' /></div>
    <div><input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' /></div>
    <button>Login</button>
  </form>);
}
