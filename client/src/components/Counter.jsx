import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../App'

import './Counter.scss'
import checked from '../assets/check.svg'
import unchecked from '../assets/dry-clean.svg'

export default function Counter () {
	const context = useContext(GlobalContext)
	const { state, dispatch } = context
	const [ finishedPieces, setFinishedPieces ] = useState([])

	const markFinishedPieces = () => {
		const newFinishedPieces = []
		for (let i = 1; i <= state.pieces[state.currentPiece].qtyNeeded; i++) {
			console.log(`Piece #${i}`, i <= state.pieces[state.currentPiece].qtyMade)
			newFinishedPieces.push(i <= state.pieces[state.currentPiece].qtyMade)
		}
		setFinishedPieces(newFinishedPieces)
	}

	useEffect(() => {
		markFinishedPieces()
		console.log(finishedPieces)
	}, [state.pieces[state.currentPiece]])

	const handleCheckBox = (i, piece) => {
		console.log(piece)
		piece === true ? dispatch({ type: 'UNCHECK_OFF_PIECE' }) : dispatch({ type: 'CHECK_OFF_PIECE' })
		console.log('dispatched')
		const newFinishedPieces = finishedPieces
		newFinishedPieces[i] = !piece
		setFinishedPieces(newFinishedPieces)
	}

	return (
		<section className="counter">
			<h1>{state.pieces[state.currentPiece].title ? state.pieces[state.currentPiece].title : "Select a piece"}</h1>
			<div className="made-checklist">
				{finishedPieces.length > 0 && finishedPieces.map((piece, i) => (
					<img
						key={`piece-check-${i}`}
						className="checked-item"
						src={piece ? checked : unchecked}
						alt="check piece status"
						title="check piece status"
						onClick={() => handleCheckBox(i, piece)}
					/>
				))}
			</div>
		</section>
	)
}