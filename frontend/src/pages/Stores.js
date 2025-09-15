import React, { useState, useEffect } from 'react';
import API from '../api';
export default function Stores(){
  const [stores,setStores]=useState([]);
  const [rating,setRating]=useState(3);
  useEffect(()=>{ fetchStores(); },[]);
  async function fetchStores(){
    try{
      const token = localStorage.getItem('token');
      const res = await API.get('/stores', { headers: token ? { Authorization: 'Bearer '+token } : {} });
      setStores(res.data);
    }catch(e){ console.error(e); alert('Could not load stores') }
  }
  async function submitRating(storeId){
    const token = localStorage.getItem('token');
    if(!token){ return alert('Login as NORMAL_USER to rate') }
    try{
      await API.post(`/stores/${storeId}/rating`, { rating }, { headers: { Authorization: 'Bearer '+token }});
      alert('Rating submitted');
      fetchStores();
    }catch(e){ alert(e.response?.data?.error || e.message) }
  }
  return (<div>
    <h3>Stores</h3>
    <div>
      {stores.map(s=>(
        <div key={s.id} style={{border:'1px solid #ccc', padding:10, margin:10}}>
          <strong>{s.name}</strong><div>{s.address}</div>
          <div>Avg Rating: {s.averageRating || 'N/A'}</div>
          <div>Your Rating: {s.userRating || 'Not rated'}</div>
          <div>
            <select value={rating} onChange={e=>setRating(parseInt(e.target.value))}>
              {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
            </select>
            <button onClick={()=>submitRating(s.id)}>Submit/Update Rating</button>
          </div>
        </div>
      ))}
    </div>
  </div>);
}
