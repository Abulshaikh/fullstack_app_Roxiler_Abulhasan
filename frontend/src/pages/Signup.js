import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
export default function Signup(){
  const [name,setName]=useState(''), [email,setEmail]=useState(''), [address,setAddress]=useState(''), [password,setPassword]=useState('');
  const nav = useNavigate();
  async function submit(e){
    e.preventDefault();
    try{
      await API.post('/auth/signup',{ name, email, address, password });
      alert('Signed up, please login');
      nav('/login');
    }catch(e){ alert(e.response?.data?.error || e.message) }
  }
  return (<form onSubmit={submit} style={{maxWidth:500}}>
    <h3>Signup</h3>
    <div><input value={name} onChange={e=>setName(e.target.value)} placeholder='Name (20-60 chars)' /></div>
    <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email' /></div>
    <div><input value={address} onChange={e=>setAddress(e.target.value)} placeholder='Address' /></div>
    <div><input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='Password' /></div>
    <button>Signup</button>
  </form>);
}
