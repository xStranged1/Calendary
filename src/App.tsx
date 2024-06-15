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
import { Hour, hours } from '../constants/hours'
import BtnAdd from '../components/buttons/BtnAdd'
import BtnDelete from '../components/buttons/BtnDelete'
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
  
  const toast = useRef<Toast>(null);

  useEffect(() => {
    console.log('renderiza todo');
    
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

  const handleAdd = () => {
    console.log('Add'); 
  }
  const handleDelete = () => {
    console.log('handleDelete'); 
  }

    const showSuccess = () => {
      toast.current?.show({severity:'success', summary: 'El evento', detail:'Ha sido creado con exito', life: 3000});
    }

    const showCodeNotExist = (code) => {
      toast.current?.show({severity:'error', summary: `Código inexistente`, detail: `El evento con código ${code} no existe`, life: 3000});
    }


  const Disponibility = () => {

    const [disponibility, setDisponibility] = useState<Nullable<Date>>(null);

    useEffect(() => {

      // let dateA = new Date()
      // dateA.setDate(15)
      // let dateB = new Date()
      // dateB.setDate(16)
      // let dateC = new Date()
      // dateC.setDate(17)
      // let dates = []
      // dates.push(dateA, dateB, dateC)
      // console.log(dates);
      
      // setDisponibility(dates)
      
    }, []);

    return(
      <div>
            <h2>Result</h2>
        <div className="card flex justify-content-center">
            <Calendar value={disponibility}
              onChange={(e) => setDisponibility(e.value)}
              selectionMode='multiple' inline readOnlyInput />
        </div>
      </div>
      
    )
  }

  const Calendary = () => {

    type Mode = 'multiple' | 'range' | 'single';
    const [dates, setDates] = useState<Nullable<Date>>(null);
    const [time, setTime] = useState<Nullable<Date>>(null);
    const [mode, setMode] = useState<Mode>('multiple');

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

  

  const WeekHours = () => {
    const checks = { Lun: false, Mar: false, Mie: false, Jue: false, Vie: false, Sab: false, Dom: false }
    const [checkeds, setCheckeds] = useState(checks);
    const DayOfWeek = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

  const Ranges = ( {day} ) => {

    const [invalidRange, setInvalidRange] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);
    const [selectedStartHour, setSelectedStartHour] = useState<Hour | null>(null);
    const [selectedEndHour, setSelectedEndHour] = useState<Hour | null>(null);

    const msgs = useRef<Messages>(null);

    useMountEffect(() => {
        msgs.current?.clear();
        msgs.current?.show({ id: '1', sticky: true, severity: 'info', summary: 'Info', detail: 'Message Content', closable: false });
    });

    const handleChecked = () => {
      let newChecks = checkeds
      newChecks[day] = !newChecks[day]
      setCheckeds(newChecks)
      setChecked(checked => !checked)
    }

    const handleChangeSelectedStartHour = (hour: Hour) => {
      (isValidRange(hour, selectedEndHour)) ? setSelectedStartHour(hour) : setInvalidRange(true)
      
    }
    const handleChangeSelectedEndHour = (hour: Hour) => {
      (isValidRange(selectedStartHour, hour)) ? setSelectedEndHour(hour) : setInvalidRange(true)
    }


      return(
        <>
          {(invalidRange && (<div className="card flex"><Message severity='error' text="La hora de inicio debería ser menor a la hora de fín" /><p>alg</p></div>))}
          
          <Checkbox onChange={handleChecked} checked={checked}></Checkbox>
          <button style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexDirection: 'row', margin: 5, marginRight: 7}} onClick={() => handleChecked(day)}>
            <p className='p-day'>{day}</p>
          </button>
          <div><Dropdown placeholder="Desde" value={selectedStartHour} onChange={(e: DropdownChangeEvent) => handleChangeSelectedStartHour(e.value)} options={hours} optionLabel="hour" 
            className="w-full md:w-8rem dropdown-hour" /></div> 
          <p style={{ marginLeft: 5, marginRight: 5, fontSize: 15, fontWeight: 'bold' }}>-</p>
          <div><Dropdown placeholder="Hasta" value={selectedEndHour} onChange={(e: DropdownChangeEvent) => handleChangeSelectedEndHour(e.value)} options={hours} optionLabel="hour" 
              className="w-full md:w-8rem dropdown-hour" /></div>
          <BtnAdd handleAdd={handleAdd} />
          <BtnDelete handleDelete={handleDelete} />
          

        </>
        
      )
    }
    
    
    return(
      <aside style={{ flex: 1 }}>
      <h2>Horas semanales</h2>
      <div className="card flex justify-content-center align-items-center">
        <div style={{ flexDirection: 'column', width: '100%' }}>
          {DayOfWeek.map((day) => (
            <div key={day} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '0.5rem' }}>
              <Ranges day={day} />
            </div>
          ))}
        </div>
      </div>
    </aside>
    )
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
        
        <WeekHours />
        <div style={{flex: 3}}>
          <h3>Disponibilidad</h3>
          <Calendary />
          <div style={{marginTop: 100}}>
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
          <h1>Calendary</h1>
          <Toast ref={toast} position="top-center" />
          {(!codeExist) && (<NoCodeSection />)}
          {(codeExist) && (<SectionCalendarys />)}
        </div>
    </div>
  );
}

export default App;
