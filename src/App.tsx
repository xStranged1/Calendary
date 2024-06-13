import { useEffect, useState, useRef } from 'react';
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
import { logDate } from '../utils/logDate'
import { Badge } from 'primereact/badge';
import { supabase } from '../utils/supabase'
import { Dialog } from 'primereact/dialog';
import { Toast, ToastMessage } from 'primereact/toast';

function App() {
  const [date, setDate] = useState<Nullable<Date>>(null);
  const [code, setCode] = useState(null);
  
  const toast = useRef<Toast>(null);

  useEffect(() => {

    // TEST
    
    // const getCountries = async () => {
    //   let { data } = await supabase.from('countries').select('name')
    //   console.log(data);
    // }
    // getCountries()


    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    setCode(code)
  }, [])

    const showSuccess = () => {
      toast.current?.show({severity:'success', summary: 'El evento', detail:'Ha sido creado con exito', life: 3000});
    }


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
          <h2>Nombre del evento</h2>
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

  const handleCreate = async (hide, e, code, eventName) => {
    
    const { data, error } = await supabase
    .from('event')
    .insert([
      { code: code, event_name: eventName },
    ])
    .select()
    
    if (!error){
      showSuccess()
      setCode(code)
      hide(e)
    }
    
    
  }

  const CreateEvent = ( {hide} ) => {

    const [eventName, setEventName] = useState<string>('');
    const [code, setCode] = useState<string>('');
    
    return(
      <div className="flex flex-column px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
          <div className="inline-flex flex-column gap-2">
              <label htmlFor="eventname" className="text-primary-50 font-semibold">
                  Nombre evento
              </label>
              <InputText id="eventname" label="eventname" value={eventName} onChange={(e) => setEventName((e.target.value))} ></InputText>
          </div>
          <div className="inline-flex flex-column gap-2">
              <label htmlFor="code" className="text-primary-50 font-semibold">
                  Código
              </label>
              <InputText id="code" label="code" value={code} onChange={(e) => setCode((e.target.value))} ></InputText>
          </div>
          <div className="flex align-items-center gap-2">
              <Button label="Crear" severity='success' onClick={(e) => handleCreate(hide, e, code, eventName)} className="p-3 w-full"></Button>
              <Button label="Cancelar" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
          </div>
      </div>
  )
  }
  const NoCodeSection = () => {
    const [inputCode, setInputCode] = useState<string>();
    const [dialogVisibility, setDialogVisibility] = useState<boolean>(false);

    return(
      <div>
        <h2>Ingresa a una sala</h2>
          <InputText placeholder='Codigo' value={inputCode} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputCode(e.target.value)} />
          <a href="http://localhost:5173?code=fasfa" style={{marginLeft: 10}}><Button label='Ingresar' /></a>
        <h2>Crear evento</h2>
        <Button label='Crear evento' onClick={() => setDialogVisibility(true)} />
        <Dialog
            visible={dialogVisibility}
            modal
            onHide={() => {if (!dialogVisibility) return; setDialogVisibility(false); }}
            content={({ hide }) => (<CreateEvent hide={hide}/>)}
        ></Dialog>
      </div>
    )
  }
  return (
      
    <div>
      
        <div className="card justify-content-center">
          <h1>Calendary</h1>
          <Toast ref={toast} position="top-center" />
          {(!code) && (<NoCodeSection />)}
          {(code) && (<SectionCalendarys />)}
        </div>
    </div>
  );
}

export default App;
