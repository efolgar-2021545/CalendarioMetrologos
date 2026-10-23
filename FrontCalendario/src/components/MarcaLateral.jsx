const MarcaLateral = () => (
    <aside className="login-marca">
        <div className="login-marca-nombre">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="1.6" />
                <path d="M7 9h12M7 13h12M7 17h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>Calendario de Salidas</span>
        </div>

        <p className="login-marca-lema">
            Salidas de campo y trabajo de laboratorio, en un solo calendario.
        </p>

        <div className="login-marca-regla" aria-hidden="true" />
    </aside>
)

export default MarcaLateral