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
import { supabase } from '../utils/supabase'
import { getFirstDates } from '../utils/getFirstDates'
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import CreateEvent from '../components/CreateEvent'
import Coordination from '../components/Coordination'
import WeekHours from '../components/WeekHours'
import SectionUsers from '../components/SectionUsers'
import Footer from '../components/Footer'

import { useToast } from '../components/toast/toast'
import { PUBLIC_URL } from '../constants/consts';

function App() {

  const [codeURL, setCodeURL] = useState<string>('');
  const [codeExist, setCodeExist] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>('');
  const [estimatedDate, setEstimatedDate] = useState<Nullable<Date[]>>(null);
  const [hostName, setHostName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [user, setUser] = useState(null)
  const toast = useRef<Toast>(null);
  const { showToast, showSuccessAddUser, showSuccess, showSuccessAvaiable, showCodeNotExist } = useToast(toast)
  

  const [session, setSession] = useState(null)

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
        console.log("session useEffect");
        console.log(session);
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }, [])

    

  useEffect(() => {
    console.log('renderiza todo');
    console.log(session);
    
    window.scrollTo(0,0)
    
    const getEventData = async (code: string) => {
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
    
    
    const [dates, setDates] = useState([]);

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
        <div className="card justify-content-center">
            <Calendar value={dates} 
              onChange={(e) => setDates(e.value)}
              selectionMode='multiple' inline />
        </div>
        <Button icon='pi pi-save' className='mt-2' label='Guardar' onClick={handleSaveEstimatedDate} />
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
        <header style={{display: 'flex', flexDirection: 'column'}}>
          <h2>Nombre del evento: "{eventName}"</h2>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5}}>
              
              <Button icon='pi pi-copy' label='Link de invitación' severity='help' 
              onClick={() => {
                let link = PUBLIC_URL+`?code=${codeURL}`
                navigator.clipboard.writeText(link)
                showToast('success', 'Enlace copiado', 'Compártelo con los invitados!')
              } } />
            </div>
          {(description) && (<div style={{justifyContent: 'center', width: "70%", alignSelf: 'center'}}><p className='description'>{description}</p></div>)}
          {(hostName) && ( <div><h2>Anfitrión del evento: {hostName}</h2></div> )}

          

        </header>
        <div className='section-main' style={{flexWrap: 'wrap'}}>
          <div style={{alignSelf: 'flex-start', flex: 1}}>
            <SectionUsers session={session} eventName={eventName} code={codeURL} handleViewUser={handleViewUser} getParticipants={getParticipants} toast={toast} />
          </div> 
          <div style={{flex: 1}}>
            <Disponibility />
          </div>
        </div>
        
        <div style={{marginTop: 100}} />
        <Coordination participants={participants} />
      </section>
      )
    
  }

  

  const ArrowLeft = () => {

    return(
      <div>
        <Button icon='pi pi-arrow-left' onClick={()=> {
          window.scrollTo(0,0)
          setUser(null)
          }} 
        />
      </div>
      
    )
  }


  const BtnSignIn = () => {
    
    return(
      <Button style={{width: 250}} icon='pi pi-google' size='small' label='Iniciar sesión con Google' onClick={()=> {
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:5173/Calendary'+"?code="+codeURL
        }
      })
    }} />
    )
  }

  const Navbar = () => {

    return(
      <div className='navbar' style={{flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{marginLeft: 120, display: 'flex', gap: 50,alignItems: 'center'}}>
          {(user) && (<ArrowLeft />)}
          <h2>Calendary</h2>
        </div>
      
        <div style={{marginRight: 30}}>
          {(!session) && (<BtnSignIn />)}
          {(session) && (
            <div>
              <h3>Logeado como {session.user.user_metadata.name}!</h3>
            </div>
          )}
        </div>
        
      </div>
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
      <Navbar />
      <div style={{paddingTop: "4rem"}} />
        <div className="card justify-content-center">
          <div className='row ds-flex gap-5'>
            {(user) && (<ArrowLeft />)}
            <h1>Calendary</h1>
          </div>
          <Toast ref={toast} position="top-center" />
          {(!codeExist) && (<NoCodeSection />)}
          {(codeExist && !user) && (<SectionCalendarys />)}
          {(codeExist && user) && (<WeekHours user={user} codeEvent={codeURL} showSuccessAvaiable={showSuccessAvaiable} />)}
        </div>
      <div style={{marginTop: "4rem"}} />
      <Footer />
    </div>
  );
}

export default App;
