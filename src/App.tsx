import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css'; // flex
import './App.css';
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import { logDate } from '../utils/logDate'
import { Badge } from 'primereact/badge';
import { supabase } from '../utils/supabase'
import { Dialog } from 'primereact/dialog';
import { Toast, ToastMessage } from 'primereact/toast';
import CreateEvent from '../components/CreateEvent'

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { checks, DayOfWeek, Hour, hours, initialIntervals, Interval, Intervals, Mode } from '../constants/hours'
import BtnAdd from '../components/buttons/BtnAdd'
import BtnDelete from '../components/buttons/BtnDelete'
import BtnSubmit from '../components/buttons/BtnSubmit'
import WeekHours from '../components/WeekHours'
import SectionUsers from '../components/SectionUsers'

import { Checkbox } from "primereact/checkbox";
import { isValidRange } from '../utils/isValidRange'
import { useMountEffect } from 'primereact/hooks';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';


function App() {

  const [date, setDate] = useState<Nullable<Date>>(null);
  const [codeURL, setCodeURL] = useState();
  const [codeExist, setCodeExist] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [user, setUser] = useState(null)
  
  const toast = useRef<Toast>(null);

  useEffect(() => {
    console.log('renderiza todo');
    window.scrollTo(0,0)
    
    const getEventName = async (code) => {
      let { data } = await supabase.from('event').select('*').eq('code', code)

      if (data?.length == 0){
        showCodeNotExist(code)
        setCodeExist(false)
        return
      }

        const objResponse = data[0]
        const eventName = objResponse.event_name
        const description = objResponse.description
        setEventName(eventName)
        setDescription(description)
        window.scrollTo(0, 0)
        setCodeExist(true)
    }

    

    


    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    if (code){
      setCodeURL(code)
      getEventName(code)
    }
  }, [])

 
    const showSuccessAddUser = (name) => {
      toast.current?.show({severity:'success', summary: `${name}`, detail:'Ha sido agregado al evento', life: 3000});
    }
    const showSuccess = () => {
      toast.current?.show({severity:'success', summary: 'El evento', detail:'Ha sido creado con exito', life: 3000});
    }
    const showSuccessAvaiable = (username) => {
      toast.current?.show({severity:'success', summary: `La disponibilidad de ${username}`, detail:'Ha sido guardada con exito', life: 3000});
    }

    const showCodeNotExist = (code) => {
      toast.current?.show({severity:'error', summary: `Código inexistente`, detail: `El evento con código ${code} no existe`, life: 3000});
    }


  const Disponibility = () => {

    const [disponibility, setDisponibility] = useState<Nullable<Date>>(null);
    window.scrollTo(0,0)

    return(
      <div>
            <h2>Fecha estimativa</h2>
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
    const [mode, setMode] = useState<Mode>('multiple');

    useEffect(() =>{
      console.log(dates);
      window.scrollTo(0,0)
      
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
            <Calendar style={{minWidth: 450}} value={dates} onChange={(e) => handleChange((e.value))}
              selectionMode={mode} dateFormat='dd/mm/yy' />
            <Button severity='success' label="Add" onClick={handleAdd} />
          </div>
          
        </div>
          <Button style={{height: 20, marginRight: 10, marginTop: 4}} disabled={mode == 'multiple'} label="Multiselect" 
            severity='warning' size="small" onClick= {()=>setMode('multiple')} />
          <Button style={{height: 20}} label="Range" severity='warning' size="small"
            disabled={mode == 'range'}  onClick= {()=>setMode('range')} />
      </div>
      {/* <h2>Time</h2>
      <Calendar style={{width: 500}} value={time} onChange={(e) => setTime(e.value)} timeOnly /> */}
      </div>

    )
  }

 


  const handleViewUser = (user) => {
    setUser(user)
  }
  const SectionCalendarys = () => {

    
    return(

      <section>
        <header>
          <h2>Evento: "{eventName}"</h2>
          <p>codigo: {codeURL}</p>
          {(description) && (<div style={{justifyContent: 'center', flex: 2, alignItems: 'center'}}><p className='description'>{description}</p></div>)}
          
        </header>
        <div className='section-main'>
        <aside style={{flex: 1}}>

          <SectionUsers code={codeURL} showSuccessAddUser={showSuccessAddUser} handleViewUser={handleViewUser} />
        </aside> 
        <div style={{flex: 3}}>
          <h3>Disponibilidad</h3>
          <Calendary />
          <div style={{marginTop: 100}}>
            <Disponibility />
          </div>
        </div>
        
        

      </div>
      

      </section>
      )
    
  }

  

  const NoCodeSection = () => {
    const [inputCode, setInputCode] = useState<string>('');
    const [dialogVisibility, setDialogVisibility] = useState<boolean>(false);

    return(
      <div>
        <h2>Ingresa a una sala</h2>
          <InputText placeholder='Codigo' value={inputCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputCode(e.target.value)} />
          <a href={`http://localhost:5173?code=${inputCode}`} style={{marginLeft: 10}}><Button label='Ingresar' /></a>
        <h2>Crear evento</h2>
        <Button label='Crear evento' onClick={() => setDialogVisibility(true)} />
        <Dialog
            visible={dialogVisibility}
            modal
            onHide={() => {if (!dialogVisibility) return; setDialogVisibility(false); }}
            content={({ hide }) => (<CreateEvent hide={hide} showSuccess={showSuccess} setCodeURL={setCodeURL}/>)}
        ></Dialog>
      </div>
    )
  }

  return (
      
    <div>
        <div className="card justify-content-center">
          <div className='row ds-flex gap-5'>
            {(user) && (<Button icon='pi pi-arrow-left' onClick={()=> {
              window.scrollTo(0,0)
              setUser(null)
            }} />)}
            <h1>Calendary</h1>
          </div>
          <Toast ref={toast} position="top-center" />
          {(!codeExist) && (<NoCodeSection />)}
          {(codeExist && !user) && (<SectionCalendarys />)}
          {(codeExist && user) && (<WeekHours user={user} codeEvent={codeURL} showSuccessAvaiable={showSuccessAvaiable} />)}
        

        </div>
    </div>
  );
}

export default App;
