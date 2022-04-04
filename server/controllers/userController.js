const { validationResult } = require('express-validator');

const userService = require('../services/userService');
const ApiError = require('../exeptions/apiError');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            console.log(errors.array());
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

        } catch (error) {

        }
    }

    async logout(req, res, next) {
        try {

        } catch (error) {

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

        } catch (error) {

        }
    }

    async getUsers(req, res, next) {
        try {
            res.json([1, 2, 3])
        } catch (error) {

        }
    }
}

module.exports = new UserController()