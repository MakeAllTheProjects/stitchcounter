import React, { useEffect, useReducer } from 'react'
import './App.scss'
import Counter from './components/Counter'
import MessageBanner from './components/MessageBanner'
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
  const piece = { ...state.pieces[state.currentPiece] } || {}
  const count = state.pieces[state.currentPiece] ? state.pieces[state.currentPiece].currentCount : 0
  let newPieces = [ ...state.pieces ] || []
  let newState = { ...state } || initialState

  switch (action.type) {
    case 'SET_FROM_LOCAL':
      if (localState) {
        newState.pieces = localState.pieces.map(piece => ({
          currentCount: parseInt(piece.currentCount),
          id: piece.id,
          title: piece.title,
          qtyMade: parseInt(piece.qtyMade),
          qtyNeeded: parseInt(piece.qtyNeeded),
          totalRowCount: parseInt(piece.totalRowCount)
        }))
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
      return newState

    case 'SELECT_PIECE':
      newState.currentPiece = action.payload.selectedPiece
      newState.message = `${newState.pieces[newState.currentPiece].title} has been selected`
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'INCREASE_COUNT': 
      if (count < piece.totalRowCount) {
        piece.currentCount = count + 1
        if (count + 1 === piece.totalRowCount) {
          if (piece.qtyMade + 1 === piece.qtyNeeded && state.currentPiece < state.pieces.length - 1) {
            piece.qtyMade = piece.qtyMade + 1
            newState.currentPiece = newState.currentPiece + 1
          } else {
            piece.qtyMade = piece.qtyMade + 1
            piece.currentCount = 0
          }
        }
      }
      newPieces[current] = piece
      newState.pieces = newPieces
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'DECREASE_COUNT':
      if (count === 0 ) {
        return state
      } else {
        piece.currentCount = piece.currentCount - 1
        if (piece.qtyMade === piece.qtyNeeded) {
          newPieces[current].qtyMade = newPieces[current].qtyMade - 1
        }
        newPieces[current] = piece
        newState.pieces = newPieces
        localStorage.setItem('stitchcount', JSON.stringify(newState))
        return newState
      }

    case 'RESET_COUNT':
      if (count === 0) {
        newState.message = "Count is already set to zero!"
        return newState
      } else {
        if (piece.qtyMade === piece.qtyNeeded) {
          newPieces[current].qtyMade = newPieces[current].qtyMade - 1
        }

        newPieces[current].currentCount = 0
        
        newState.pieces = newPieces
        newState.message = `${piece.title}'s current count has been reset.`

        localStorage.setItem('stitchcount', JSON.stringify(newState))
        return newState
      }

    case 'CHECK_OFF_PIECE':
      if ( piece.qtyMade + 1 === piece.qtyNeeded ) {
        newPieces[current].qtyMade = piece.qtyMade + 1
        newState.pieces = newPieces
        newState.currentPiece = current > state.pieces.length ? current + 1 : current
        newState.message = `You have made all the needed ${piece.title} pieces.`
      } else {
        newPieces[current].qtyMade = piece.qtyMade + 1
        newState.pieces = newPieces
        newState.message = `You have finished a piece. New ${piece.title} ready to start.`
      }

      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'UNCHECK_OFF_PIECE':
      if ( piece.qtyMade === 0 ) {
        return state
      } else {
        newPieces[current].qtyMade = piece.qtyMade - 1
        newState.pieces = newPieces
        newState.message = `${piece.title} has been frogged 🐸!`
        localStorage.setItem('stitchcount', JSON.stringify(newState))
        return newState
      }

    case 'ADD_PIECE':
      newPieces.push({
        id: state.pieces.length === 0 ? 0 : state.pieces[state.pieces.length - 1].id + 1,
        title: action.payload.title,
        qtyNeeded: action.payload.qtyNeeded,
        qtyMade: 0,
        totalRowCount: action.payload.totalRowCount,
        currentCount: 0
      })
      newState.pieces = newPieces
      newState.isPieceFormOpen = false
      newState.isEdit = false
      newState.message = `${action.payload.title} has been added to the list.`
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'REMOVE_PIECE':
      newPieces = newPieces.filter((obj, i) => i !== current)
      newState.pieces = newPieces
      newState.currentPiece = current === 0 ? 0 : current - 1
      newState.isPieceFormOpen = current === 0 && newPieces.length === 0 ? true : false
      newState.message = `${piece.title} has been removed from the list.`
      localStorage.setItem('stitchcount', JSON.stringify(newState))
      return newState

    case 'EDIT_PIECE':
      newPieces[current] = {
        id: current,
        title: action.payload.title,
        qtyNeeded: action.payload.qtyNeeded,
        qtyMade: piece.qtyMade,
        totalRowCount: action.payload.totalRowCount,
        currentCount: piece.currentCount
      }
      newState.pieces = newPieces
      newState.isPieceFormOpen = false
      newState.message = `${piece.title} has been updated.${piece.currentCount > action.payload.totalRowCount ? ` You will need to frog 🐸 ${piece.currentCount - action.payload.totalRowCount} row${piece.currentCount - action.payload.totalRowCount === 1 ? '' : 's'}.` : ''}`
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
    if (state.pieces.length === 0) {
      dispatch({type: 'TOGGLE_FORM', payload: { isEdit: false }})
    }
  }, [])

  return (
    <>
      <div className="app-background"/>
      <GlobalContext.Provider value={{state: state, dispatch: dispatch}}>
        <div className="app">
          <MessageBanner/>
          {state.isPieceFormOpen && <PieceForm />}
          {state.pieces.length > 0 && !state.isPieceFormOpen && <Counter />}
          {state.pieces.length > 0 && <PieceList />}
        </div>
      </GlobalContext.Provider>
    </>
  )
}

export default App
