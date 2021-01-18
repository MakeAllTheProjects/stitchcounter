import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../App'

import './Counter.scss'
import checked from '../assets/check.svg'
import unchecked from '../assets/dry-clean.svg'
import editIcon from '../assets/edit.svg'
import deleteIcon from '../assets/garbage.svg'

export default function Counter () {
	const context = useContext(GlobalContext)
	const { state, dispatch } = context
	const [ finishedPieces, setFinishedPieces ] = useState([])

	const markFinishedPieces = () => {
		const newFinishedPieces = []
		for (let i = 1; i <= state.pieces[state.currentPiece].qtyNeeded; i++) {
			newFinishedPieces.push(i <= state.pieces[state.currentPiece].qtyMade)
		}
		setFinishedPieces(newFinishedPieces)
	}

	useEffect(() => {
		markFinishedPieces()
	}, [state.pieces[state.currentPiece]])

	const handleCheckBox = (i, piece) => {
		piece === true ? dispatch({ type: 'UNCHECK_OFF_PIECE' }) : dispatch({ type: 'CHECK_OFF_PIECE' })
		const newFinishedPieces = finishedPieces
		newFinishedPieces[i] = !piece
		setFinishedPieces(newFinishedPieces)
	}

	return (
		<section className="counter">
			<div className="piece-control-panel">
				<img
					className="control-button edit"
					alt="edit piece"
					title="edit piece"
					src={editIcon}
					onClick={() => dispatch({
						type: 'TOGGLE_FORM',
						payload: {
							isEdit: true
						}
					})}
				/>
				<img
					className="control-button delete"
					alt="delete piece"
					title="delete piece"
					src={deleteIcon}
					onClick={() => dispatch({
						type: 'REMOVE_PIECE'
					})}
				/>
			</div>
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
			<div className="count-container">
				<button
					className="add"
					onClick={() => dispatch({ type: "INCREASE_COUNT" })}
				>
					+
				</button>
				<p className="count">{state.pieces[state.currentPiece].currentCount}</p>
				<button
					className="subtract"
					onClick={() => dispatch({ type: "DECREASE_COUNT"})}
				>
					-
				</button>
			</div>
			<p>of {state.pieces[state.currentPiece].totalRowCount}</p>
			<button className="reset-count" onClick={() => dispatch({ type: "RESET_COUNT"})}>Reset Count</button>
		</section>
	)
}