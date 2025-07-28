// import { useEffect, useState } from 'react';

// export default function UpdateWardsPage() {
//   const [wards, setWards] = useState([]);
//   const [wardName, setWardName] = useState('');
//   const [pin, setPin] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   // Fetch wards on component load
//   useEffect(() => {
//     fetch('https://n8cir.onrender.com/admin/wards', {
//       credentials: 'include',  // if you use sessions/cookies
//     })
//       .then((res) => res.json())
//       .then(setWards)
//       .catch(() => setError('Failed to load wards'));
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setMessage('');

//     if (!wardName || !pin) {
//       setError('Please enter ward name and PIN');
//       return;
//     }

//     try {
//       const res = await fetch('https://n8cir.onrender.com/admin/wards', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include', // if session auth is needed
//         body: JSON.stringify({ ward_name: wardName, pin }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage(data.message || 'Ward updated/added successfully');
//         // Refresh wards list after update
//         const refreshed = await fetch('https://n8cir.onrender.com/admin/wards', {
//           credentials: 'include',
//         });
//         const updatedWards = await refreshed.json();
//         setWards(updatedWards);
//         setWardName('');
//         setPin('');
//       } else {
//         setError(data.error || 'Error updating ward');
//       }
//     } catch {
//       setError('Network error while updating ward');
//     }
//   };

//   return (
//     <div style={{ padding: 20, maxWidth: 500, margin: 'auto' }}>
//       <h2>Update or Add Wards & Staff PINs</h2>

//       {message && <p style={{ color: 'green' }}>{message}</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Ward Name"
//           value={wardName}
//           onChange={(e) => setWardName(e.target.value)}
//           style={{ width: '100%', padding: 8, marginBottom: 8 }}
//           required
//         />
//         <input
//           type="text"
//           placeholder="PIN"
//           value={pin}
//           onChange={(e) => setPin(e.target.value)}
//           style={{ width: '100%', padding: 8, marginBottom: 8 }}
//           required
//         />
//         <button type="submit" style={{ padding: '8px 16px' }}>
//           Save
//         </button>
//       </form>

//       <h3 style={{ marginTop: 40 }}>Existing Wards & PINs</h3>
//       <ul>
//         {wards.length === 0 && <li>No wards found</li>}
//         {wards.map(({ id, name }) => (
//           <li key={id}>
//             <strong>{name}</strong>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
