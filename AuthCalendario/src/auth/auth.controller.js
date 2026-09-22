import * as authService from './auth.service.js'

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const result = await authService.loginUser(email, password)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}