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
import { supabase } from '../utils/supabase'
import { getFirstDates } from '../utils/getFirstDates'
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import CreateEvent from '../components/CreateEvent'
import Coordination from '../components/Coordination'
import { Mode } from '../constants/hours'
import WeekHours from '../components/WeekHours'
import SectionUsers from '../components/SectionUsers'

import { useToast } from '../components/toast/toast'

function App() {

  const [date, setDate] = useState<Nullable<Date>>(null);
  const [codeURL, setCodeURL] = useState();
  const [codeExist, setCodeExist] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>('');
  const [estimatedDate, setEstimatedDate] = useState<Nullable<Date>>(null);
  const [hostName, setHostName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [user, setUser] = useState(null)

  const DOMAIN = 'localhost:5173/'
  const toast = useRef<Toast>(null);
  const { showToast, showSuccessAddUser, showSuccess, showSuccessAvaiable, showCodeNotExist } = useToast(toast)
  

  useEffect(() => {
    console.log('renderiza todo');
    window.scrollTo(0,0)
    
    const getEventData = async (code) => {
      let { data } = await supabase.from('event').select('*').eq('code', code)

      if (data?.length == 0){
        showCodeNotExist(code)
        setCodeExist(false)
        return
      }

        const objResponse = data[0]
        const eventName = objResponse.event_name
        const hostName = objResponse.host_name
        const estimatedDate = objResponse.estimated_date
        const description = objResponse.description
        setEstimatedDate(estimatedDate)
        setHostName(hostName)
        setEventName(eventName)
        setDescription(description)
        setEstimatedDate(estimatedDate)
        setCodeExist(true)
        window.scrollTo(0, 0)
    }

    

    


    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    if (code){
      setCodeURL(code)
      getEventData(code)
    }
  }, [])



  const Disponibility = () => {
    
    useEffect(()=> {
      let initialDates = []
      if(estimatedDate){
        estimatedDate.forEach(date => {
          const objDate = new Date(date)
          initialDates.push(objDate)
        });
        setDates(initialDates)
      }
    }, [])
    const [dates, setDates] = useState<Nullable<Date>>(null);

    
    const handleSaveEstimatedDate = async () => {

      if(!dates || dates.length == 0){
        showToast('error', 'La fecha estimativa del evento', 'No esta seleccionada')
        return
      }
      
      const firstDate = getFirstDates(dates)
      
      if(Date.parse(firstDate) < Date.parse(Date())){
        showToast('error', 'La fecha estimativa del evento', 'No puede ser menor a la fecha actual')
        return
      }
      
      const { data, error } = await supabase
        .from('event')
        .update({estimated_date: dates})
        .eq('code', codeURL)
        .select()
        console.log(data);
        
        if (!error){
          showToast('success', 'La fecha estimativa del evento', 'Ha sido guardada con exito')
        }else{
          showToast('error', 'Hubo un error', '')
        }
        
      return error
    }

    return(
      <div>
        <h2>Fecha estimativa del evento</h2>
        <div className="card flex justify-content-center">
            <Calendar value={dates} 
              onChange={(e) => setDates(e.value)}
              selectionMode='multiple' inline />
        </div>
        <Button icon='pi pi-save' className='mt-2' label='Guardar' onClick={handleSaveEstimatedDate} />
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

    const [participants, getParticipants] = useState([]);
    
    return(

      <section>
        <header>
          <h2>Evento: "{eventName}"</h2>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{marginRight: 5}}>
                <h3>codigo: {codeURL}</h3>
              </div>
              <Button icon='pi pi-copy' label='Link de invitación' severity='help'  className='mt-2' 
              onClick={() => {
                let link = DOMAIN+`?code=${codeURL}`
                navigator.clipboard.writeText(link)
                showToast('success', 'Enlace copiado', 'Compártelo con los invitados!')
              } } />
            </div>
            
          {(description) && (<div style={{justifyContent: 'center', flex: 2, alignItems: 'center'}}><p className='description'>{description}</p></div>)}
          {(hostName) && ( <div><h2>Anfitrión del evento: {hostName}</h2></div> )}
        </header>
        <div className='section-main'>
          <aside style={{flex: 1}}>

            <SectionUsers code={codeURL} showSuccessAddUser={showSuccessAddUser} handleViewUser={handleViewUser} getParticipants={getParticipants} />
          </aside> 
          <div style={{flex: 3}}>
            <div style={{marginTop: 100}}>
              <Disponibility />
            </div>
          </div>
          
        </div>
        
        <div style={{marginTop: 100}} />
        <Coordination participants={participants} />
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
