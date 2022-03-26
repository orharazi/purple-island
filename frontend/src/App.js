import React, {useState, useEffect} from 'react'
import logo from './logo.svg';
import './App.css';
import { Navbar, Container } from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Routes ,
  Route,
  Link, 
  Navigate,
  useLocation
} from "react-router-dom";
import {
  useDispatch,
  useSelector
} from 'react-redux'
import { setUser } from './reducers/users.reducer'

import NavbarComponent from './components/navbar'
import Profile from './components/profile'
import TradeCenter from './components/tradeCenter'
import Users from './components/users'


function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  useEffect(() => {
    const setUserData = async () => {
      const prevUser = localStorage.getItem('prevUser')
      if (prevUser) {
        await Promise.resolve(dispatch(setUser(JSON.parse(prevUser))))
      }
      setLoading(false)
    }
    setUserData()
    
  }, [])

  function RequireAuth({ children }) {
    let location = useLocation();
  
    if (user.username === '') {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
      return <Navigate to="/users" state={{ from: location }} replace />;
    }
  
    return children;
  }

  if (!loading) {
    return (
      <Router>
        <NavbarComponent />
        <Routes >
          <Route path='/' element={
            <RequireAuth>
              <TradeCenter/>
            </RequireAuth>
          } />
          <Route path='/Profile' element={
            <RequireAuth>
              <Profile/>
            </RequireAuth>
          } />
          <Route path='/Users' element={<Users/>} />

        </Routes >
      </Router> 
    )
  } else {
    return (
      <h1>loading...</h1>
    )
  }
}

export default App;
