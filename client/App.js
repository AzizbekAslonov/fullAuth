import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  const store = useContext(Context)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  return (
    <div className="App">
      <h1>{store.isAuth ? store.user.email : 'UnAuthorized'}</h1>
      <LoginForm />
    </div>
  )
}

export default observer(App)
// https://youtu.be/fN25fMQZ2v0?t=5409