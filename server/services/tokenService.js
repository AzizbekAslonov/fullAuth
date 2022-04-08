const jwt = require('jsonwebtoken')
const { Token } = require('../models')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, { expiresIn: '30d' })

        return { accessToken, refreshToken }
    }

    validateAccess(token) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_KEY_ACCESS)
            return userData
        } catch (error) {
            return null
        }
    }

    validateRefresh(token) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_KEY_REFRESH)
            return userData
        } catch (error) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { userId } })

        if (tokenData) {
            await tokenData.update({ refreshToken })
            return tokenData
        } else {
            const token = await Token.create({ userId, refreshToken })
            return token
        }
    }

    async removeToken(refreshToken) {
        const isDeleted = await Token.destroy({ where: { refreshToken } })
        return isDeleted
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({ where: { refreshToken } })
        return tokenData
    }
}

module.exports = new TokenService()