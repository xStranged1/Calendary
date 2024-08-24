import { Button } from 'primereact/button';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabase';
import 'primeicons/primeicons.css'; //icons
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { textAttendanceTooltip } from '../constants/texts'
import { User } from '../constants/user'
import { useToast } from './toast/toast';

const SectionUsers = ({ session, code, eventName, handleViewUser, getParticipants, toast }) => {

  const [participants, setParticipants] = useState([])
  const [dialogVisibility, setDialogVisibility] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [dialogConfirmVisibility, setDialogConfirmVisibility] = useState<boolean>(false);
  const [confirmedUser, setConfirmedUser] = useState(null)

  const { showToast, showSuccessAddUser, showSuccess, showSuccessAvaiable, showCodeNotExist } = useToast(toast)

  useEffect(() => {
    const getUsers = async (code) => {
      let { data, error } = await supabase.from('user').select('*').eq('code_event', code)
      if (data?.length == 0) {
        return
      }
      if (!error) {


        let participants = data
        for (let i = 0; i < participants.length; i++) {
          let user: User = participants[i];
          if (user.is_invited) {
            user.is_invited = 'Si'
          } else {
            user.is_invited = 'No'
          }

          if (user.attendance_confirmed) {
            user.attendance_confirmed = 'Si'
          } else {
            user.attendance_confirmed = 'No'
          }

          if (user.avaiable) {
            user.avaiableText = 'Tiene'
          } else {
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
      <Button icon='pi pi-user-plus' severity='success' label='Agregar participante' onClick={() => {
        setDialogVisibility(true)
        console.log('algo');

      }
      } />
    </div>
  )

  const FormUser = ({ hide }) => {
    const [inputUsername, setInputUsername] = useState(null)


    const handleAddUser = async (username, e) => {
      if (!username) return
      const { data, error } = await supabase
        .from('user')
        .insert([
          { code_event: code, username: username },
        ])
        .select()

      if (!error) {
        location.replace(`http://localhost:5173?code=${code}`)
        window.scrollTo(0, 0)
        showSuccessAddUser(username)
        hide(e)
        setDialogVisibility(false)
      }
      if (error) console.log(error);

    }


    return (
      <div className='modal-add-user'>
        <label htmlFor="eventname" className="font-semibold" style={{ float: 'left', marginBottom: 5, fontFamily: 'Poppins' }}>
          Participante
        </label>
        <div style={{ marginTop: 5 }}>
          <InputText placeholder='Nombre del participante' value={inputUsername}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputUsername(e.target.value)}
            style={{ fontFamily: 'Poppins' }} />
        </div>

        <div style={{ flex: 1, flexDirection: 'row', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginTop: 20 }}>
          <div>
            <Button label='Cancelar' severity='danger' onClick={(e) => {
              setDialogVisibility(false)
              hide(e)
            }} />
          </div>
          <div>
            <Button label='Agregar' severity='success' onClick={(e) => handleAddUser(inputUsername, e)} />
          </div>
        </div>



      </div>
    )
  }

  const handleViewAvaible = (event) => {
    handleViewUser(event.data)
  }


  const userView = (user) => {

    return (
      <div className='row ds-flex bg-red'>
        <span className="pi pi-user mr-2 flex" style={{ color: "#009" }}></span>
        <p style={{ fontWeight: '500' }}>{user.username}</p>
        <div style={{ flex: 1 }} />
      </div>
    )
  }


  const isAlreadyConfirmed = async (id) => {
    const { data, error } = await supabase
      .from('user')
      .select()
      .eq('code_event', code)
      .eq('id_google', id)
    if (error) {
      showToast('error', 'Hubo un error', '')
      console.log(error);
      return
    }
    const isConfirmed = (data.length == 0) ? false : true
    return isConfirmed
  }

  const handleConfirmAttendance = async () => {

    console.log(session);
    const id = session.user.id

    if (await isAlreadyConfirmed(id)) return showToast('error', 'Hay un problema', 'Esta cuenta de Google ya confirmo la asistencia de otro invitado')

    const { data, error } = await supabase
      .from('user')
      .update({ id_google: id })
      .eq('code_event', code)
      .eq('username', confirmedUser)
      .select()
    if (error) {
      showToast('error', 'Hubo un error', '')
      console.log(error);
      return
    }

    await confirmAttendance()
  }

  const confirmAttendance = async () => {
    setDialogConfirmVisibility(false)

    const { data, error } = await supabase
      .from('user')
      .update({ attendance_confirmed: true })
      .eq('code_event', code)
      .eq('username', confirmedUser)
      .select()
    console.log(data);

    if (!error) {
      showToast('success', 'La asistencia', 'Ha sido confirmada con exito')
    } else {
      showToast('error', 'Hubo un error', '')
      console.log(error);
    }
  }

  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <span className="font-bold white-space-nowrap">{confirmedUser}</span>
    </div>
  );
  const footerContent = (
    <div>
      <Button label="Confirmar asistencia" icon="pi pi-check" onClick={handleConfirmAttendance} autoFocus />
    </div>
  );
  const DialogConfirm = () => {

    return (
      <div className="card flex justify-content-center">
        <Dialog visible={dialogConfirmVisibility} modal header={headerElement} footer={footerContent} style={{ width: '50rem' }} onHide={() => { if (!dialogConfirmVisibility) return; setDialogConfirmVisibility(false); }}>
          <p className="m-0">
            Se confirmará la asistencia de
            <span style={{ fontVariant: '600' }}> {confirmedUser}</span>
            <span> al evento "{eventName}" y los demás invitados podrán verlo</span>
          </p>
        </Dialog>
      </div>
    )
  }

  const handleConfirm = (username) => {
    if (!session) {
      console.log('notiene session');
    } else {
      const email = session.user.email
      setConfirmedUser(username)
      setDialogConfirmVisibility(true)
    }
  }

  const attendanceView = (user: User) => {
    const confirmed = user.attendance_confirmed
    const username = user.username
    let severity, label, enabled
    if (confirmed == 'No') {
      severity = 'secondary'
      label = 'Confirmar'
      enabled = true
    } else {
      severity = 'success'
      label = 'Confirmado'
      enabled = false
    }

    return (
      <div className='row ds-flex'>
        <Button label={label} size='small' disabled={!enabled} severity={severity} onClick={() => handleConfirm(username)} />
        <div style={{ flex: 1 }} />
      </div>
    )
  }
  const avaiableView = (user) => {

    const color = (user.avaiable) ? '#900' : '#009'

    return (
      <div className='row ds-flex'>
        <p style={{ fontWeight: '500' }}>{user.avaiableText}</p>
      </div>


    )
  }


  const headerAttendance = () => (
    <div className='row ds-flex'>
      <p>Asistencia confirmada</p>
      <span className="pi pi-question-circle ml-2 flex" style={{ color: "#000" }}></span>
    </div>
  )




  return (
    <div className='row'>
      <h2>Participantes: {participants.length}</h2>
      <Dialog
        visible={dialogVisibility}
        modal
        onHide={() => { if (!dialogVisibility) return; setDialogVisibility(false); }}
        content={({ hide }) => (<FormUser hide={hide} />)}
      ></Dialog>

      <DialogConfirm />

      <div className='data-table'>
        <div>
          <DataTable value={participants} selectionMode='single' selection={selectedUser} onRowSelect={handleViewAvaible}
            style={{ borderWidth: 1, flex: 3, borderStyle: 'solid', borderColor: "#ccc" }}
            paginator rows={5}
            metaKeySelection={false}
            onSelectionChange={(e) => setSelectedUser(e.value)} dataKey="id" tableStyle={{ minWidth: '25rem', maxWidth: '30rem' }}>
            <Column field="username" header="Nombre" body={userView}></Column>
            <Column field="is_invited" header="Invitado"></Column>
            <Column field="attendance_confirmed" body={attendanceView} headerTooltip={textAttendanceTooltip} header={headerAttendance}></Column>
            <Column field="avaiableText" header='Disponibilidad' body={avaiableView}></Column>
          </DataTable>
        </div>
      </div>

      <Button icon='pi pi-user-plus' className='mt-3' severity='success' label='Agregar participante' onClick={() => setDialogVisibility(true)} />

    </div>
  )
}
export default SectionUsers
