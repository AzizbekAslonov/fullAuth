const jwt = require('jsonwebtoken')
const { Token } = require('../models')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.SECRET_KEY_ACCESS, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.SECRET_KEY_REFRESH, { expiresIn: '30d' })

        return { accessToken, refreshToken }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { userId } })
        if (tokenData) {
            return tokenData.update({ refreshToken })
        }

        const token = await Token.create({ userId, refreshToken })
        return token
    }
}

module.exports = new TokenService()