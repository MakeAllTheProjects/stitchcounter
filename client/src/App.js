import axios from 'axios'
import React, { useEffect, useReducer } from 'react'
import './App.scss'
import MessageBanner from './components/MessageBanner'

export const baseURL = process.env.REACT_APP_IS_PRODUCTION ? 'https://myherokuapp.herokuapp.com/api' : 'http://localhost:8080/api'

export const GlobalContext = React.createContext()

const initialWelcomeState = {
  loading: true,
  message: ""
}
const welcomeReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        loading: false,
        message: action.message
      }
    case 'FETCH_ERROR':
      return {
        loading: false,
        message: 'Something went wrong!'
      }
    default: 
      return state
  }
}

function App () {
  const [welcomeState, welcomeDispatch] = useReducer(welcomeReducer, initialWelcomeState)

  useEffect(() => {
    axios.get(baseURL)
      .then(res => {
        welcomeDispatch({
          type: 'FETCH_SUCCESS',
          message: res.data.message
        })
      })
      .catch(err => {
        console.error(err)
        welcomeDispatch({
          type: 'FETCH_ERROR'
        })
      })
  }, [])

  return (
    <div className="App">
      App
      <GlobalContext.Provider
        value={{
          welcomeState: welcomeState,
          welcomeDispatch: welcomeDispatch
        }}
      >
        <MessageBanner />
      </GlobalContext.Provider>      
    </div>
  )
}

export default App
