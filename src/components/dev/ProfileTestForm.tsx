import { useState } from 'react';
import { createProfileRequest, getMyProfileRequest } from '../../services/authService';

export function ProfileTestForm() {
  const [data, setData] = useState({
    first_name: 'Ivan',
    last_name: 'Ivanov',
    phone_number: '+79998887766',
    age: 30,
    about_me: 'I love travel',
    activities: ['sightseeing', 'hiking'],
    country: 'Russia',
    city: 'Moscow',
    citizenship: 'Russian',
    currency: 'RUB',
    avatar_url: ''
  });
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const handlePost = async () => {
    setError(null);
    try {
      const res = await createProfileRequest(data);
      setResponse(res);
    } catch (e) {
      setError(e);
    }
  };

  const handleGet = async () => {
    setError(null);
    try {
      const res = await getMyProfileRequest();
      setResponse(res);
    } catch (e) {
      setError(e);
    }
  };

  return (
    <div style={{ background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', color: '#000' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Profile Test</h3>
        <textarea 
            value={JSON.stringify(data, null, 2)} 
            onChange={(e) => {
                try {
                    setData(JSON.parse(e.target.value));
                } catch (err) {
                    console.error('Invalid JSON');
                }
            }}
            style={{ width: '100%', height: '150px', fontSize: '12px' }}
        />
        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
            <button onClick={handlePost}>POST</button>
            <button onClick={handleGet}>GET me</button>
        </div>
        {response && <pre style={{ fontSize: '10px', background: '#eee', marginTop: '10px', padding: '5px', maxHeight: '100px', overflow: 'auto' }}>{JSON.stringify(response, null, 2)}</pre>}
        {error && <pre style={{ fontSize: '10px', color: 'red', marginTop: '10px', padding: '5px' }}>{JSON.stringify(error, null, 2)}</pre>}
    </div>
  );
}
