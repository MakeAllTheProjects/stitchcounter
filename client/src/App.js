import React, { useEffect, useReducer, useState } from 'react'
import './App.scss'

export const baseURL = process.env.REACT_APP_IS_PRODUCTION ? 'https://myherokuapp.herokuapp.com/api' : 'http://localhost:8080/api'

export const GlobalContext = React.createContext()

const initialState = {
  pieces: [],
  currentPiece: 0,
  isPieceFormOpen: false
}

export const CountReducer = (state, action) => {
  const piece = state.pieces[state.currentPiece]
  const count = piece.currentCount
  const localState = JSON.parse(localStorage.getItem('stitchcount'))
  const current = state.currentPiece

  let newPieces = [...state.pieces]
  let newState = { ...state }

  switch (action.type) {
    case 'TOGGLE_FORM':
      return {
        ...state,
        isPieceFormOpen: !state.isPieceFormOpen
      }

    case 'SELECT_PIECE':
      newState.currentPiece = action.payload.selectedPiece
      localStorage.setItem('stitchcount', newState)
      return newState

    case 'SET_FROM_LOCAL':
      return {
        ...state,
        pieces: localState.pieces,
        currentPiece: localState.currentPiece
      }

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

      localStorage.setItem('stitchcount', newState)
      return newState

    case 'DECREASE_COUNT':
      if ( count === 0 ) {
        return state
      } else {
        newPieces[current].currentCount = count - 1
        newState.pieces = newPieces

        localStorage.setItem('stitchcount', newState)
        return newState
      }

    case 'RESET_COUNT':
      if (count === 0) {
        return state
      } else {
        newPieces[current].currentCount = 0
        newState.pieces = newPieces

        localStorage.setItem('stitchcount', newState)
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

      localStorage.setItem('stitchcount', newState)
      return newState

    case 'UNCHECK_OFF_PIECE':
      if ( current.qtyMade === 0 ) {
        return state
      } else {
        newPieces[current].qtyMade = current.qtyMade - 1
        newState.pieces = newPieces
        localStorage.setItem('stitchcount', newState)
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
      localStorage.setItem('stitchcount', newState)
      return newState

    case 'REMOVE_PIECE':
      newState = newState.filter(obj => obj.id !== current)
      localStorage.setItem('stitchcount', newState)
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
      localStorage.setItem('stitchcount', newState)
      return newState

    case 'RESET_ALL_PIECES':
      newPieces = newPieces.map(obj => { return {...obj, currentCount: 0, qtyMade: 0} })
      newState.pieces = newPieces
      localStorage.setItem('stitchcount', newState)
      return newState

    case 'DELETE_ALL_PIECES':
      return initialState

    default:
      return state
  }
}

function App () {
  return (
    <>
      <div className="app-background"/>
      <div className="app">
        
      </div>
    </>
  )
}

export default App
