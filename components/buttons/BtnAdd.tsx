
import { Button } from 'primereact/button';

const BtnAdd = ({ handleAdd }) => (
    <Button style={{marginLeft: 10, height: "2rem", width: "2rem"}}
     onClick={handleAdd} severity='success' size='small' icon="pi pi-plus" />
)

export default BtnAdd
