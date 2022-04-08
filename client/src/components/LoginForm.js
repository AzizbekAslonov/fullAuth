import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Context } from '../index'
import UserService from '../services/UserService'

function LoginForm() {
    const [email, setEmail] = useState('aslonovazizbek@gmail.com')
    const [password, setPassword] = useState('123')
    const [users, setUsers] = useState(null)
    const store = useContext(Context)

    const getUsers = async () => {
        try {
            const response = await UserService.fetchUsers()
            setUsers(response.data)
        } catch (error) {

        }
    }

    return (
        <div>
            {!store.isAuth && <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>}

            <div className="buttons">
                {store.isAuth ? <div>
                    <button onClick={() => store.activate()}>
                        Activate
                    </button>
                    <button onClick={() => store.logout()}>
                        Logout
                    </button>
                </div>
                    : <div>
                        <button onClick={() => store.login(email, password)}>
                            Login
                        </button>
                        <button onClick={() => store.registration(email, password)}>
                            Register
                        </button>
                    </div>
                }
                <br />
            </div>
            <button onClick={getUsers}>
                Получить пользователей
            </button>
            {users && <table style={{ textAlign: 'center' }}>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>IsActivated</th>
                </tr>
                {users.map(us => (
                    <tr key={us.id}>
                        <td>{us.id}</td>
                        <td>{us.email}</td>
                        <td>{us.password.slice(0, 6) + '...'}</td>
                        <td>{us.isActivated ? 1 : 0}</td>
                    </tr>
                ))}
            </table>}
        </div>
    )
}

export default observer(LoginForm)