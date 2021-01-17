import React, { useEffect, useReducer } from 'react'
import './App.scss'
import Counter from './components/Counter'
import PieceForm from './components/PieceForm'
import PieceList from './components/PieceList'

export const baseURL = process.env.REACT_APP_IS_PRODUCTION ? 'https://myherokuapp.herokuapp.com/api' : 'http://localhost:8080/api'

export const GlobalContext = React.createContext()

const initialState = {
  pieces: [],
  currentPiece: 0,
  isPieceFormOpen: false,
  isEdit: false,
  message: ''
}

export const CountReducer = (state, action) => {
  const localState = JSON.parse(localStorage.getItem('stitchcount'))
  const current = state.currentPiece || 0
  const piece = state.pieces[current] || {}
  const count = piece.currentCount || 0
  let newPieces = [...state.pieces] || []
  let newState = { ...state } || initialState

  switch (action.type) {
    case 'SET_FROM_LOCAL':
      if (localState) {
        newState.pieces = localState.pieces
        newState.isPieceFormOpen = localState.isPieceFormOpen
        newState.currentPiece = localState.currentPiece
        newState.message = 'Saved state found'
        return newState
      } else {
        newState.isPieceFormOpen = true
        newState.message = 'No saved state found'
        return newState
      }

    case 'TOGGLE_FORM':
      newState.isPieceFormOpen = state.pieces.length === 0 ? true : !state.isPieceFormOpen
      newState.isEdit = action.payload.isEdit || false
      return newState

    case 'SELECT_PIECE':
      newState.currentPiece = action.payload.selectedPiece
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'INCREASE_COUNT': 
      if (count + 1 === piece.totalRowCount) { 
        if (piece.qtyMade === piece.qtyNeeded) { 
          newPieces[current].currentCount = count + 1
          newPieces[current].qtyMade = current.qtyMade + 1
          newState.pieces =  newPieces
          newState.currentPiece = current + 1
        } else {
          newPieces[current].currentCount = 0
          newPieces[current].qtyMade = current.qtyMade + 1
          newState.pieces = newPieces
        }        
      } else { 
        newPieces[current].currentCount = 0
        newState.pieces = newPieces
      }

      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'DECREASE_COUNT':
      if ( count === 0 ) {
        return state
      } else {
        newPieces[current].currentCount = count - 1
        newState.pieces = newPieces

        localStorage.setItem('stitchcount', JSON.stringify(newState))
        return newState
      }

    case 'RESET_COUNT':
      if (count === 0) {
        return state
      } else {
        newPieces[current].currentCount = 0
        newState.pieces = newPieces

        localStorage.setItem('stitchcount', JSON.stringify(newState))
        return newState
      }

    case 'CHECK_OFF_PIECE':
      if ( current.qtyMade + 1 === current.qtyNeeded ) {
        newPieces[current].qtyMade = current.qtyMade + 1
        newState.pieces = newPieces
        newState.currentPiece = current > state.pieces.length ? current + 1 : current
      } else {
        newPieces[current].qtyMade = current.qtyMade + 1
        newState.pieces = newPieces
      }

      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'UNCHECK_OFF_PIECE':
      if ( current.qtyMade === 0 ) {
        return state
      } else {
        newPieces[current].qtyMade = current.qtyMade - 1
        newState.pieces = newPieces
        localStorage.setItem('stitchcount', JSON.stringify(newState))
        return newState
      }

    case 'ADD_PIECE':
      newPieces.push({
        id: current,
        tite: action.payload.title,
        qtyNeeded: action.payload.qtyNeeded,
        qtyMade: action.payload.qtyMade,
        totalRowCount: action.payload.totalRowCount,
        currentCount: action.payload.currentCount
      })
      newState.pieces = newPieces
      newState.isPieceFormOpen = false
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'REMOVE_PIECE':
      newPieces = newPieces.filter(obj => obj.id !== current)
      newState.pieces = newPieces
      newState.isPieceFormOpen = false
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'EDIT_PIECE':
      newPieces[current] = {
        id: current,
        tite: action.payload.title,
        qtyNeeded: action.payload.qtyNeeded,
        qtyMade: action.payload.qtyMade,
        totalRowCount: action.payload.totalRowCount,
        currentCount: action.payload.currentCount
      }
      newState.pieces = newPieces
      newState.isPieceFormOpen = false
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'RESET_ALL_PIECES':
      newPieces = newPieces.map(obj => { return {...obj, currentCount: 0, qtyMade: 0} })
      newState.pieces = newPieces
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'DELETE_ALL_PIECES':
      newState = initialState
      newState.isPieceFormOpen = true
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    default:
      return state
  }
}

function App () {
  const [state, dispatch] = useReducer(CountReducer, initialState)

  useEffect(() => {
    dispatch({type: 'SET_FROM_LOCAL'})
  }, [])
  
  useEffect(() => {
    console.log(state.message)
  }, [state.message])

  return (
    <>
      <div className="app-background"/>
      <GlobalContext.Provider value={{state: state, dispatch: dispatch}}>
        <div className="app">
          {state.isPieceFormOpen && <PieceForm />}
          {state.pieces.length > 0 && <Counter />}
          {state.pieces.length > 0 && <PieceList />}
        </div>
      </GlobalContext.Provider>
    </>
  )
}

export default App
