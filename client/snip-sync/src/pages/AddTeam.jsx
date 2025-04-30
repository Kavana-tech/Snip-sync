import React, { useState, useRef } from 'react';
import { Copy } from 'lucide-react'; // You can also use any other icon library or SVG

const AddTeam = () => {
  const [inviteLink, setInviteLink] = useState('https://yourapp.com/invite/team123');
  const inputRef = useRef(null);

 const handleCopy = () => {
  navigator.clipboard.writeText(inviteLink)
    .then(() => {
      console.log('Link copied!');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
};


  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={inviteLink}
          readOnly
          ref={inputRef}
          style={{ width: '100%', paddingRight: '40px', height: '40px' }}
        />
        <Copy
          onClick={handleCopy}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            cursor: 'pointer',
          }}
        />
      </div>
      <button style={{ marginTop: '20px' }}>Skip</button>
    </div>
  );
};

export default AddTeam;
