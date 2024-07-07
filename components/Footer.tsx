import { Divider } from "primereact/divider";

export default function Footer() {
    return(
        <div style={{ flex: 1, marginTop: 100}}>
            <div className="divider mb-5" />
                <div className="row flex">
                    <h3>Dev</h3>
                    <a href="https://github.com/xStranged1" target="_blank" className="row flex">
                        <i className="pi pi-github ml-2 mr-1" style={{ fontSize: '1.5rem' }}></i>
                        <h3>xStranged1</h3>
                    </a>
            </div>
        </div>
    )
}