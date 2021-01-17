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
        newState.message = 'Saved project found'
        return newState
      } else {
        newState.isPieceFormOpen = true
        return newState
      }

    case 'TOGGLE_FORM':
      newState.isPieceFormOpen = state.pieces.length === 0 ? true : !state.isPieceFormOpen
      newState.isEdit = action.payload.isEdit || false
      newState.message = newState.isEdit ? "Form open" : "Form closed"
      return newState

    case 'SELECT_PIECE':
      newState.currentPiece = action.payload.selectedPiece
      newState.message = `${newState.pieces[newState.currentPiece].title} has been selected`
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'INCREASE_COUNT': 
      if (count + 1 === piece.totalRowCount) { 
        if (piece.qtyMade === piece.qtyNeeded) { 
          newPieces[current].currentCount = count + 1
          newPieces[current].qtyMade = current.qtyMade + 1
          newState.pieces =  newPieces
          newState.currentPiece = current + 1
          newState.message = `You have made all the needed ${piece.title} pieces! ${newState.currentPiece !== state.pieces.length - 1 ? 'On to the next...' : ''}`
        } else {
          newPieces[current].currentCount = 0
          newPieces[current].qtyMade = current.qtyMade + 1
          newState.pieces = newPieces
          newState.message = `You have finished a piece! New ${piece.title} ready to start.`
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
        newState.message = "Count is already set to zero!"
        return newState
      } else {
        newPieces[current].currentCount = 0
        newState.pieces = newPieces
        newState.message = `${piece.title}'s current count has been reset.`

        localStorage.setItem('stitchcount', JSON.stringify(newState))
        return newState
      }

    case 'CHECK_OFF_PIECE':
      if ( current.qtyMade + 1 === current.qtyNeeded ) {
        newPieces[current].qtyMade = current.qtyMade + 1
        newState.pieces = newPieces
        newState.currentPiece = current > state.pieces.length ? current + 1 : current
        newState.message = `You have made all the needed ${piece.title} pieces.`
      } else {
        newPieces[current].qtyMade = current.qtyMade + 1
        newState.pieces = newPieces
        newState.message = `You have finished a piece. New ${piece.title} ready to start.`
      }

      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'UNCHECK_OFF_PIECE':
      if ( current.qtyMade === 0 ) {
        return state
      } else {
        newPieces[current].qtyMade = current.qtyMade - 1
        newState.pieces = newPieces
        newState.message = `${piece.title} has been frogged 🐸!`
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
      newState.message = `${piece.title} has been added to the list.`
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'REMOVE_PIECE':
      newPieces = newPieces.filter(obj => obj.id !== current)
      newState.pieces = newPieces
      newState.isPieceFormOpen = false
      newState.message = `${piece.title} has been removed from the list.`
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
      newState.message = `${piece.title} has been updated.`
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'RESET_ALL_PIECES':
      newPieces = newPieces.map(obj => { return {...obj, currentCount: 0, qtyMade: 0} })
      newState.pieces = newPieces
      newState.message = `Project has been reset.`
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'DELETE_ALL_PIECES':
      newState = initialState
      newState.isPieceFormOpen = true
      newState.message = `Project has been deleted. You may now start a new project.`
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
