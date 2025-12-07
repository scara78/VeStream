import React from 'react';
import { THEME } from '@/constants/config';
import { Plus } from 'lucide-react';

const AVATARS = [
  "https://i.pinimg.com/736x/c5/ba/44/c5ba44e99557b282d1c0e3a4e98f62f8.jpg",
  "https://i.pinimg.com/736x/15/d2/88/15d28876c1b3336d859714c30c31c925.jpg",
  "https://i.pinimg.com/736x/b2/a0/29/b2a029a6c275bf87d81a965709b1f7d3.jpg",
  "https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg"
];

const ProfileSelector = ({ onSelect }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#020617', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.5s ease-out' }}>
    <h1 style={{ color: '#fff', fontSize: '3rem', fontWeight: 800, marginBottom: '3rem', letterSpacing: '-1px' }}>Who's watching?</h1>
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
      {AVATARS.map((img, i) => (<div key={i} onClick={() => onSelect({ name: `User ${i + 1}`, avatar: img })} className="profile-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: '0.2s' }}><div style={{ width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', border: '3px solid transparent', transition: '0.2s' }} className="avatar-box"><img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div><span style={{ color: '#94a3b8', fontSize: '1.1rem', transition: '0.2s' }} className="profile-name">User {i + 1}</span></div>))}
    </div>
    <style>{`.profile-card:hover .avatar-box { border-color: ${THEME.accent}; transform: scale(1.05); } .profile-card:hover .profile-name { color: #fff; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
  </div>
);
export default ProfileSelector;