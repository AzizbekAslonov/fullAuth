const { Router } = require('express')
const { body } = require('express-validator')

const userController = require('../controllers/userController')
const router = new Router()

router.post('/registration', [
    body('email', 'Неверный email').isEmail(),
    body('password').isString().withMessage('Пароль должен быть строку').isLength({ min: 3, max: 30 }).withMessage('Пароль должен содержать минимум 3 и максимум 30 символов')
    // 
], userController.registration)

router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', userController.getUsers)

module.exports = router