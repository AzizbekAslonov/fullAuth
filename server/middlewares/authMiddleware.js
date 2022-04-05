const ApiError = require("../exeptions/apiError")
const tokenService = require("../services/tokenService")

module.exports = function (req, res, next) {
    try {
        // if we don't have `authorization` header 
        const authHeader = req.headers.authorization
        if (!authHeader) next(ApiError.UnauthorizedError())
        // if we don't have token
        const accessToken = authHeader.split(' ')[1]
        if (!accessToken) next(ApiError.UnauthorizedError())
        // if token is not valid
        const userData = tokenService.validateAccess(accessToken)
        if (!userData) next(ApiError.UnauthorizedError())

        req.user = userData
        next()
    } catch (error) {
        next(ApiError.UnauthorizedError())
    }
}