import React, { useEffect,useContext, useReducer, createContext } from 'react';
import './App.css';
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Switch, Link, useHistory } from "react-router-dom"
import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import Profiles from './components/screens/Profiles'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
// import { sign } from 'jsonwebtoken';
import { reducer, initialState } from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({ type: 'USER', payload: user })
    } else {
      history.push('./Login')
    }
  }, [])
  return (
    <Switch>
    <Route exact path="/" >
    <Home />
    </Route>
    <Route path="/Login">
      <Login />
    </Route>
    <Route path="/signup">
      <Signup />
    </Route>
    <Route exact path="/Profiles">
      <Profiles />
    </Route>
    <Route path="/createPost">
      <CreatePost/>
    </Route>
    <Route path="/Profiles/:userid">
      <UserProfile />
    </Route>
    
  </Switch>
  )
}
// useEffect(() => {

// }, [])
function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>

      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>

    </UserContext.Provider>
  );
}

export default App;
