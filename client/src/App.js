import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  const store = useContext(Context)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth().finally(() => setLoading(prev => !prev))
    } else {
      setLoading(prev => !prev)
    }
  }, [])

  return loading && (
    <div className="App">
      <h1>{store.isAuth ? store.user.email : 'UnAuthorized'}</h1>
      <LoginForm />
      {store.isAuth ? (
        <p style={{ marginTop: '90px' }}>
          {JSON.stringify(store.user, null, 4)}
        </p>
      ) : null}
    </div>
  )

}

export default observer(App)