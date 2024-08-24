import { Button } from 'primereact/button'
import '../src/App.css'
import IconPrimeReact from '../src/assets/primereact.svg'
import { useEffect, useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import SupabaseLink from '../components/buttons/SupabaseLink'
import { InputTextarea } from 'primereact/inputtextarea'
import { TEXT_PLACEHOLDER_LEAVE_FEEDBACK } from '../constants/texts'
import { handleSendFeedback } from '../utils/handleSendFeedback'
import { Toast } from 'primereact/toast'
import { useToast } from './toast/toast'

export default function Footer({ toast }) {

    const { showToast } = useToast(toast)
    const [dialogVisibility, setDialogVisibility] = useState(false)
    const sendingFeedback = useRef(false)

    const ModalLeaveFeedback = ({ hide }) => {

        const [inputName, setInputName] = useState('')
        const [inputEmail, setInputEmail] = useState('')
        const [inputComment, setInputComment] = useState('')
        const [warning, setWarning] = useState(false)

        useEffect(() => {
            // Función que se ejecuta cuando la ventana se enfoca de nuevo
            const handleFocus = () => {
                if (sendingFeedback.current == true) {
                    showToast('success', 'Tu comentario', 'Se envió correctamente')
                    sendingFeedback.current = false
                }
            };

            window.addEventListener('focus', handleFocus);

            return () => {
                window.removeEventListener('focus', handleFocus);
            };
        }, []);



        const handleSend = () => {
            if (!inputComment) {
                showToast('error', 'Error', 'No hay un comentario')
                setWarning(true)
                return
            }
            const urlForm = `https://docs.google.com/forms/d/e/1FAIpQLSei72emhE3Hgj-lwKkzTh2SQiabaRTWXTSLwSEOZV93VzHzuA/formResponse?submit=Submit&usp=pp_url&entry.999074890=${inputName}&entry.1287369822=${inputEmail}&entry.663830842=${inputComment}`;
            window.open(urlForm, '_blank');
            sendingFeedback.current = true
        }

        return (
            <div className='modal-leave-feedback'>
                <Toast ref={toast} position="top-center" />

                <div className='input-group'>
                    <label htmlFor="eventname" className="font-semibold" style={{ fontFamily: 'Poppins' }}>
                        Nombre
                    </label>
                    <div className="card justify-content-center">
                        <InputText placeholder='Nombre (Opcional)' value={inputName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputName(e.target.value)}
                            style={{ fontFamily: 'Poppins', width: 350 }} />
                    </div>
                </div>

                <div className='input-group'>
                    <label htmlFor="eventname" className="font-semibold" style={{ marginBottom: 5, fontFamily: 'Poppins' }}>
                        E-mail
                    </label>
                    <div className="card justify-content-center" >
                        <InputText placeholder='E-mail (Opcional)' value={inputEmail}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputEmail(e.target.value)}
                            style={{ fontFamily: 'Poppins', width: 350 }}
                        />
                    </div>
                </div>

                <div className='input-group'>
                    <label htmlFor="eventname" className="font-semibold" style={{ marginBottom: 5, fontFamily: 'Poppins' }}>
                        Comentario
                    </label>
                    <div className="card justify-content-center">
                        <InputTextarea id="comment" value={inputComment}
                            invalid={warning}
                            placeholder={TEXT_PLACEHOLDER_LEAVE_FEEDBACK}
                            style={{ fontFamily: 'Poppins', minWidth: 225, width: 350, maxWidth: 450 }}
                            onChange={(e) => {
                                setInputComment(e.target.value)
                                setWarning(false)
                            }} rows={6} cols={30} />
                    </div>
                </div>

                <div style={{ flex: 1, flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 20 }}>
                    <Button label='Cancelar' severity='danger' onClick={(e) => {
                        setDialogVisibility(false)
                        hide(e)
                    }} />
                    <Button label='Enviar' icon='pi pi-send' severity='success' onClick={handleSend} />
                </div>

            </div>
        )
    }

    return (
        <div className="footer">

            <Dialog
                visible={dialogVisibility}
                modal
                onHide={() => { if (!dialogVisibility) return; setDialogVisibility(false); }}
                content={({ hide }) => (<ModalLeaveFeedback hide={hide} />)}
            ></Dialog>

            <a href="https://github.com/xStranged1" target="_blank" className="row flex" style={{ color: "#fff" }}>
                <h3>Dev: </h3>
                <i className="pi pi-github ml-2 mr-1" style={{ fontSize: '1.5rem' }}></i>
                <h3 style={{ color: "#61f127" }}>xStranged1</h3>
            </a>

            <Button label='Deja tu feedback!' size='small' severity='warning' icon='pi pi-comment' style={{ fontFamily: 'Poppins' }}
                onClick={() => setDialogVisibility(true)}
            />


            <a href="https://primereact.org/" target='_blank' className='row flex' style={{ color: "#fff" }}>
                <i className="pi pi-prime" style={{ fontSize: '1.6rem', color: "#07b7d4", marginRight: 7 }}></i>
                <h4>PRIMEREACT</h4>
            </a>

            <SupabaseLink />
        </div>
    )
}