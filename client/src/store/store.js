import { makeAutoObservable } from "mobx";
import AuthService from '../services/AuthService'

export default class Store {
    user = {};
    isAuth = false;

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool) {
        this.isAuth = bool
    }

    setUser(user) {
        this.user = user
    }

    async login(email, password) {
        try {
            const response = await AuthService.login(email, password)
            localStorage.setItem('token', response.data.accessToken)
            this.setUser(response.data.user)
            this.setAuth(true)
        } catch (error) {
            console.log(error.response?.data?.message)
        }
    }

    async registration(email, password) {
        try {
            const response = await AuthService.registration(email, password)
            localStorage.setItem('token', response.data.accessToken)
            this.setUser(response.data.user)
            this.setAuth(true)
        } catch (error) {
            console.log(error.response?.data?.message)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout()
            localStorage.removeItem('token', response.data.accessToken)
            this.setUser({})
            this.setAuth(false)
        } catch (error) {
            console.log(error.response?.data?.message)
        }
    }
}