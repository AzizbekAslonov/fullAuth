const { validationResult } = require('express-validator');

const userService = require('../services/userService');
const ApiError = require('../exeptions/apiError');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Oшибка при валидации', errors.array()))
            }
            const { email, password } = req.body
            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json(userData)
        } catch (error) {
            return next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies

            const isDeleted = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(isDeleted)
        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.json("OK!")
            // return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            return next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })
        } catch (error) {
            return next(error)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getUsers()
            res.json(users)
        } catch (error) {
            return next(error)
        }
    }
}

module.exports = new UserController()