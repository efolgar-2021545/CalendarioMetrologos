import * as usersService from './users.service.js'

export const listMetrologos = async (req, res) => {
    try {
        res.status(200).json(await usersService.getMetrologos())
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getMetrologo = async (req, res) => {
    try {
        res.status(200).json(await usersService.getUserById(req.params.id))
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const editMetrologo = async (req, res) => {
    try {
        res.status(200).json(await usersService.updateUser(req.params.id, req.body))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const toggleMetrologoStatus = async (req, res) => {
    try {
        res.status(200).json(await usersService.toggleUserStatus(req.params.id))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const listSolicitudes = async (req, res) => {
    try {
        res.status(200).json(await usersService.getSolicitudes())
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const aprobarSolicitud = async (req, res) => {
    try {
        res.status(200).json(await usersService.aprobarUsuario(req.params.id))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const rechazarSolicitud = async (req, res) => {
    try {
        res.status(200).json(await usersService.rechazarUsuario(req.params.id))
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getDirectorio = async (req, res) => {
    try {
        res.status(200).json(await usersService.getDirectorio())
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const updateMyPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        const result = await usersService.changePassword(
            req.user.id,
            currentPassword,
            newPassword
        )

        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}