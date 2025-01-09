import { Link } from 'react-router-dom'

export function NotFoundPage() {
    return (
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <h1 style={{fontSize: '36px'}}>404</h1>
            <div>
                <h2 style={{textAlign: 'center', fontWeight: '500'}}>Página no encontrada</h2>
                <p style={{textAlign: 'center'}}>La página que buscas no existe o ha sido eliminada.</p>
            </div>
            <div>
                <Link to="/" className="btn btn-solid">Volver al inicio</Link>
            </div>
        </section>
    )
}