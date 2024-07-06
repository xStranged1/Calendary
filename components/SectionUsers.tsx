import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import 'primeicons/primeicons.css'; //icons
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { textDisponibilityTooltip } from '../constants/hours';

const SectionUsers = ( {code, showSuccessAddUser, handleViewUser, getParticipants} ) => {
  
  const [participants, setParticipants] = useState([])
  const [dialogVisibility, setDialogVisibility] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)


  useEffect(()=> {

    const getUsers = async (code) => {
      let { data, error } = await supabase.from('user').select('*').eq('code_event', code)
      if (data?.length == 0){
        return
      }
      if(!error){


        let participants = data
        for (let i = 0; i < participants.length; i++) {
          let user = participants[i];
          if(user.is_invited){
            user.is_invited = 'Si'
          }else{
            user.is_invited = 'No'
          }

          if(user.attendance_confirmed){
            user.attendance_confirmed = 'Si'
          }else{
            user.attendance_confirmed = 'No'
          }

          if(user.avaiable){
            user.avaiableText = 'Tiene'
          }else{
            user.avaiableText = 'No tiene'
          }

        }
        setParticipants(participants)
        getParticipants(participants)
      }

    }

    getUsers(code)

  }, [])

  

  if (participants.length == 0 && !dialogVisibility) return (
    <div className='row'>
        <h3>No hay participantes en el evento</h3>
        <Button icon='pi pi-user-plus' severity='success' label='Agregar participante' onClick={()=>{
          setDialogVisibility(true)
          console.log('algo');
          
        }
          } />
    </div>
    )

  const FormUser = ({hide}) => {
    const [inputUsername, setInputUsername] = useState(null)
    

    const handleAddUser = async (username, e) => {
      if(!username) return
      const { data, error } = await supabase
        .from('user')
        .insert([
          { code_event: code, username: username },
        ])
        .select()
        
        if (!error){
          location.replace(`http://localhost:5173?code=${code}`)
          window.scrollTo(0, 0)
          showSuccessAddUser(username)
          hide(e)
          setDialogVisibility(false)
        }
        if(error) console.log(error);
        
    }


    return(
      <div style={{padding: 100, backgroundColor: "#ccc", border: 1, borderRadius: 5}}>
          <label htmlFor="eventname" className="font-semibold ">
              Nombre de usuario
          </label>
        <div>
          <InputText placeholder='Nombre de usuario' value={inputUsername} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputUsername(e.target.value)} />
        </div>

        <div style={{flex: 1, flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20}}>
          <div>
            <Button label='Agregar' severity='success' onClick={(e)=>handleAddUser(inputUsername, e)} />
          </div>
          <div>
            <Button label='Cancelar' severity='danger' onClick={(e)=>{
              setDialogVisibility(false)
              hide(e)
            }} />
          </div>
        </div>
          
          

      </div>
    )
  }

  const handleViewAvaible = (event) => {
    handleViewUser(event.data)
  }


  const userView = (user) => {
    
    return(
      <div className='row ds-flex bg-red'>
        <span className="pi pi-user mr-2 flex" style={{color: "#009"}}></span>
        <p style={{fontWeight: '500'}}>{user.username}</p>
        <div style={{flex: 1}} />
      </div>
    )
  }

  const avaiableView = (user) => {

    const color = (user.avaiable) ? '#900' : '#009'

    return(
      <div className='row ds-flex'>
        <p style={{fontWeight: '500'}}>{user.avaiableText}</p>
        <span className="pi pi-clock ml-2 flex" style={{color: color}}></span>
        <div style={{flex: 1}} />
      </div>


    )
  }

  const headerDisponibility = () => (
    <div className='row ds-flex'>
      <p>Disponibilidad</p>
      <span className="pi pi-question-circle ml-2 flex" style={{color: "#000"}}></span>
    </div>
  )


  
    return(
        <div className='row'>
            <h2>Participantes: {participants.length}</h2>
            <Dialog
                visible={dialogVisibility}
                modal
                onHide={() => {if (!dialogVisibility) return; setDialogVisibility(false); }}
                content={({ hide }) => (<FormUser hide={hide}/>)}
            ></Dialog>

            <DataTable value={participants} selectionMode='single' selection={selectedUser} onRowSelect={handleViewAvaible}
            paginator rows={5}
            style={{border: 1, borderWidth: 1, borderStyle: 'solid', borderColor: "#ccc"}}
            metaKeySelection={false}
            onSelectionChange={(e) => setSelectedUser(e.value)} dataKey="id" tableStyle={{ minWidth: '25rem', maxWidth: '30rem' }}>
                <Column field="username" header="Nombre" body={userView}></Column>
                <Column field="is_invited" header="Invitado"></Column>
                <Column field="attendance_confirmed" header="Asistencia confirmada"></Column>
                <Column field="avaiableText" header={headerDisponibility} headerTooltip={textDisponibilityTooltip} body={avaiableView}></Column>
            </DataTable>

            <Button icon='pi pi-user-plus' className='mt-3' severity='success' label='Agregar participante' onClick={()=>setDialogVisibility(true)} />

        </div>
    )
}
export default SectionUsers
