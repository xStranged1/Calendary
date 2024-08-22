
import { Button } from 'primereact/button';

const BtnSubmit = ({ handleSubmit }) => (
    <Button onClick={handleSubmit} label='Guardar disponibilidad' severity='info' size='small' icon="pi pi-save" />
)

export default BtnSubmit
