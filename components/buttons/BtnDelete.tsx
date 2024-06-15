
import { Button } from 'primereact/button';

const BtnDelete = ({ handleDelete }) => (
    <Button style={{marginLeft: 10, height: "2rem", width: "2rem"}}
     onClick={handleDelete} severity='danger' size='small' icon="pi pi-times" />
)

export default BtnDelete
