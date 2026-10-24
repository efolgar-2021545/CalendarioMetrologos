// Consulta el directorio de usuarios al servicio AuthCalendario
export const obtenerDirectorio = async () => {
    const base = process.env.AUTH_SERVICE_URL
    const clave = process.env.INTERNAL_API_KEY

    if (!base || !clave) {
        throw new Error('Faltan AUTH_SERVICE_URL o INTERNAL_API_KEY en el .env de Calendario')
    }

    let respuesta

    try {
        // Espera hasta 70 s porque el servicio de usuarios puede estar despertando
        respuesta = await fetch(`${base}/internal/directorio`, {
            headers: { 'x-internal-key': clave },
            signal: AbortSignal.timeout(70000)
        })
    } catch {
        throw new Error(
            'No se pudo conectar con el servicio de usuarios (AuthCalendario). Verifica que esté encendido.'
        )
    }

    if (!respuesta.ok) {
        throw new Error(
            'El servicio de usuarios rechazó la consulta. Verifica que INTERNAL_API_KEY sea idéntica en ambos servicios.'
        )
    }

    return await respuesta.json()
}

// Busca un usuario aprobado por su id
export const obtenerUsuario = async (id) => {
    if (!id) throw new Error('Debes seleccionar un metrólogo')

    const directorio = await obtenerDirectorio()
    const usuario = directorio.find((u) => u.id === id)

    if (!usuario) throw new Error('El metrólogo seleccionado no existe o no está aprobado')

    return usuario
}

// Igual que el anterior, pero además exige que esté activo (para poder agendarlo)
export const obtenerMetrologoActivo = async (id) => {
    const usuario = await obtenerUsuario(id)

    if (!usuario.isActive) {
        throw new Error(`${usuario.name} está inactivo y no se le puede agendar`)
    }

    return usuario
}