
import { Button } from 'primereact/button';

const BtnSubmit = ({ handleSubmit }) => (
    <Button onClick={handleSubmit} label='Guardar disponibilidad' severity='secondary' size='small' icon="pi pi-save" />
)

export default BtnSubmit
