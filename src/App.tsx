import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
import './App.css';
import { Calendar } from 'primereact/calendar';

const ShowCode = () => {
  const params = new URLSearchParams(location.search);
  const code = params.get('code');

  return <p>El código es: {code}</p>;
};


function App() {
  const [date, setDate] = useState(new Date());
  const [code, setCode] = useState(null);
  const [dates, setDates] = useState(null);
  
  useEffect(() =>{
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    setCode(code)
  }, [])
  return (
      
    <div className="App">
      <h1>Calendary</h1>
      <div>
        <h2>Event Name</h2>
        <p>codigo: {code}</p>
      </div>
      <div>
        <h3>Select disponibility range</h3>
      </div>

        <div className="card flex justify-content-center">
            <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" dateFormat='dd/mm/yy' />
        </div>
            </div>
  );
}

export default App;
