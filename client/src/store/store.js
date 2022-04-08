import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
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

    async checkAuth() {
        try {
            const response = await axios.get(`${API_URL}/refresh`, {
                withCredentials: true
            })
            console.log(response);
            localStorage.setItem('token', response.data.accessToken)
            this.setUser(response.data.user)
            this.setAuth(true)
        } catch (error) {
            console.log(error.response?.data?.message)
        }
    }

    activate() {
        if (this.user) {
            this.setUser({ ...this.user, isActivated: true })
            console.log('user activated!');
        } else {
            console.log('user not found!');
        }
    }
}