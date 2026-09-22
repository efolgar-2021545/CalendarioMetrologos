import * as usersService from './users.service.js'

export const listMetrologos = async (req, res) => {
    try {
        const metrologos = await usersService.getMetrologos()
        res.status(200).json(metrologos)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getMetrologo = async (req, res) => {
    try {
        const user = await usersService.getUserById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const editMetrologo = async (req, res) => {
    try {
        const updated = await usersService.updateUser(req.params.id, req.body)
        res.status(200).json(updated)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const toggleMetrologoStatus = async (req, res) => {
    try {
        const result = await usersService.toggleUserStatus(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}