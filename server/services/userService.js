const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

const ApiError = require('../exeptions/apiError');
const UserDto = require('../dtos/userDto');
const { User } = require('../models');
const mailService = require('./mailService');
const tokenService = require('./tokenService');

class UserService {
    async registration(email, password) {
        const candidate = await User.findOne({
            where: { email }
        })
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid()
        const user = await User.create({ email, password: hashPassword, activationLink })

        // await mailService.sendActivationMail(email, activationLink)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(user.id, tokens.refreshToken)

        return { ...tokens, user: userDto }
    }

    async activate(activationLink) {
        const user = await User.findOne({ where: { activationLink } })
        if (!user) {
            throw ApiError.BadRequest(`Неверная ссылка активации`)
        }
        user.isActivated = 1
        await user.save()
    }
}

module.exports = new UserService()