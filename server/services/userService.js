const bcrypt = require('bcrypt')
const { v4: uuid } = require('uuid')

const ApiError = require('../exeptions/apiError')
const UserDto = require('../dtos/userDto')
const { User, Token } = require('../models')
const mailService = require('./mailService')
const tokenService = require('./tokenService')

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

    async login(email, password) {
        const user = await User.findOne({ where: { email } })
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }

        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
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

    async logout(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()

        const isDeleted = await tokenService.removeToken(refreshToken)
        if (!isDeleted) throw ApiError.UnauthorizedError()

        return isDeleted
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()

        const userData = tokenService.validateRefresh(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) throw ApiError.UnauthorizedError()

        const user = await User.findByPk(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return { ...tokens, user: userDto }
    }

    async getUsers() {
        const users = await User.findAll()
        return users
    }
}

module.exports = new UserService()