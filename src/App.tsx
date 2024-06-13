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
import { Nullable } from "primereact/ts-helpers";
import { logDate } from '../helpers/logDate'
import { Badge } from 'primereact/badge';

function App() {
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [code, setCode] = useState(null);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    setCode(code)
  }, [])

  
  const Disponibility = () => {

    const [disponibility, setDisponibility] = useState<Nullable<Date>>(null);

    useEffect(() => {

      let dateA = new Date()
      dateA.setDate(15)
      let dateB = new Date()
      dateB.setDate(16)
      let dateC = new Date()
      dateC.setDate(17)
      let dates = []
      dates.push(dateA, dateB, dateC)
      console.log(dates);
      
      setDisponibility(dates)
      
    }, []);

    return(
      <div>
        <div className="card flex justify-content-center">
            <Calendar value={disponibility}
              onChange={(e) => setDisponibility(e.value)}
              selectionMode='multiple' inline readOnlyInput />
        </div>
      </div>
      
    )
  }

  const Calendary = () => {

    const [dates, setDates] = useState<Nullable<Date>>(null);
    const [time, setTime] = useState<Nullable<Date>>(null);

    useEffect(() =>{
      console.log(dates);
      
      logDate(dates)
    }, [dates])

    const handleChange = (date) => {
      setDates(date)
    }

    const handleAdd = () => {
      console.log('add');
      
    }
    
    
    return(
      <div>

      <div style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
        <div>
          <h2>Date</h2>
          <div className='row'>
            <Calendar style={{minWidth: 450}} value={dates} onChange={(e) => handleChange((e.value))} selectionMode="range" dateFormat='dd/mm/yy' />
            <Button severity='success' label="Add" onClick={handleAdd} />
          </div>
          
        </div>
          <Button label="Multiselect" severity='warning' size="small" />
          <Button label="Range" severity='warning' size="small" />
      </div>
      {/* <h2>Time</h2>
      <Calendar style={{width: 500}} value={time} onChange={(e) => setTime(e.value)} timeOnly /> */}
      </div>

    )
  }



  const SectionCalendarys = () => {

    return(

      <section>
        <header>
          <h2>Event Name</h2>
          <p>codigo: {code}</p>
        </header>
        <div className='section-main'>
        
        <aside style={{flex: 1}}>
          <p>aside</p>
        </aside> 
        <div style={{flex: 4}}>
          <h3>Select disponibility range</h3>
          <Calendary />
          <div style={{marginTop: 100}}>
            <h2>Result</h2>
            <Disponibility />
          </div>
        </div>
        <aside style={{flex: 1}}>
          <p>aside</p>
        </aside> 
        

      </div>
      

      </section>
      )
    
  }

  const NoCodeSection = () => {
    const [inputCode, setInputCode] = useState<string>();

    return(
      <div>
        <h2>Ingresa a una sala</h2>
          <InputText placeholder='Codigo' value={inputCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputCode(e.target.value)} />
          <a href="http://localhost:5173?code=fasfa" style={{marginLeft: 10}}><Button label='Ingresar' /></a>
        <h2>Crear sala</h2>
        <Button label='Crear sala' />
      </div>
    )
  }
  return (
      
    <div>
      
        <div className="card justify-content-center">
          <h1>Calendary</h1>
          {(!code) && (<NoCodeSection />)}
          {(code) && (<SectionCalendarys />)}
        </div>
    </div>
  );
}

export default App;
