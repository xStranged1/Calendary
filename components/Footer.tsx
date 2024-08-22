import '../src/App.css'
export default function Footer() {
    return(
        <div className="footer">
            <div className="row flex">
                <h3>Dev: </h3>
                <a href="https://github.com/xStranged1" target="_blank" className="row flex">
                    <i className="pi pi-github ml-2 mr-1" style={{ fontSize: '1.5rem' }}></i>
                    <h3>xStranged1</h3>
                </a>
            </div>
                <h4>primeReact</h4>
            <h4>Supabase</h4>

        </div>
    )
}