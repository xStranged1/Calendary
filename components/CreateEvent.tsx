import { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import React from "react";
import { supabase } from '../utils/supabase'
import { InputTextarea } from "primereact/inputtextarea";




const handleCreate = async (hide, e, code, eventName, hostName, description, showSuccess, setCodeURL) => {
    
    const { data, error } = await supabase
    .from('event')
    .insert([
      { code: code, event_name: eventName, host_name: hostName, description: description },
    ])
    .select()
    
    if (!error){
      showSuccess()
      hide(e)
      location.replace(`http://localhost:5173?code=${code}`)
      window.scrollTo(0, 0)
    }
  }


function CreateEvent( {hide, showSuccess, setCodeURL} ) {

  const generateRandomCode = (length) => {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    setCode(code)
  }

    const [code, setCode] = useState<string>('');
    const [eventName, setEventName] = useState<string>('');
    const [hostName, setHostName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    
    return(
      <div className="flex flex-column px-8 py-5 gap-3" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
          <div className="inline-flex flex-column gap-2">
              <label htmlFor="eventname" className="text-primary-50 font-semibold">
                  Nombre evento
              </label>
              <InputText id="eventname" label="eventname" value={eventName} onChange={(e) => setEventName((e.target.value))} ></InputText>
          </div>
          <div className="inline-flex flex-column gap-2">
              <label htmlFor="hostname" className="text-primary-50 font-semibold">
                  Anfitrión
              </label>
              <InputText id="hostname" label="hostname" value={hostName} onChange={(e) => setHostName((e.target.value))} ></InputText>
          </div>
          <div className="inline-flex flex-column gap-2">
              <label htmlFor="code" className="text-primary-50 font-semibold">
                  Código
              </label>
            <div className="inline-flex flex-row gap-2">
              <InputText id="code" label="code" value={code} onChange={(e) => setCode((e.target.value))} ></InputText>
              <Button icon="pi pi-sync" severity="info" onClick={() => generateRandomCode(11)} />
            </div>
          </div>
          <div className="inline-flex flex-column gap-2">
            <label htmlFor="description" className="text-primary-50 font-semibold">
                  Descripción
            </label>
            <InputTextarea value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} rows={5} cols={30} />
          </div>
          <div className="flex align-items-center gap-2">
              <Button label="Crear" severity='success' onClick={(e) => handleCreate(hide, e, code, eventName, hostName, description, showSuccess, setCodeURL)} className="p-3 w-full"></Button>
              <Button label="Cancelar" onClick={(e) => hide(e)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
          </div>
      </div>
  )
}
export default CreateEvent
