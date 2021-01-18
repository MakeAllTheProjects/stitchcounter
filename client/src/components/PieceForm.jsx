import React, { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../App'
import './PieceForm.scss'

export default function PieceForm () {
	const context = useContext(GlobalContext)
	const { state, dispatch } = context
	const [title, setTitle] = useState('')
	const [qtyNeeded, setQtyNeeded] = useState(1)
	const [totalRowCount, setTotalRowCount] = useState(1)

	useEffect(() => {
		const current = state.pieces[state.currentPiece]
		setTitle(current.title)
		setQtyNeeded(current.qtyNeeded)
		setTotalRowCount(current.totalRowCount)
	}, [state.isEdit])

	const handleSubmit = e => {
		e.preventDefault()
		const action = state.isEdit ? 'EDIT_PIECE' : 'ADD_PIECE'
		dispatch({
			type: action,
			payload: {
				title: title,
				qtyNeeded: qtyNeeded,
				totalRowCount: totalRowCount
			}
		})
		setTitle("")
		setQtyNeeded(1)
		setTotalRowCount(1)
	}

	return (
		<form className="piece-form" onSubmit={e => handleSubmit(e)}>
			{state.pieces.length === 0 && <h3>You have no pieces in this project</h3>}
			<h2>Add a Piece to Project</h2>
			<label htmlFor="title">Name of Piece</label>
			<input
				name="title"
				type="text"
				value={title}
				onChange={e => setTitle(e.target.value)}
				placeholder="piece name"
				required
			/>
			<label htmlFor="qtyNeeded">Number of Pieces Needed</label>
			<input
				name="qtyNeeded"
				type="number"
				value={qtyNeeded}
				onChange={e => setQtyNeeded(e.target.value)}
				placeholder="number of pieces needed"
				min={1}
				required
			/>
			<label htmlFor="totalRowCount">Number of Rows in Piece</label>
			<input
				name="totalRowCount"
				type="number"
				value={totalRowCount}
				onChange={e => setTotalRowCount(e.target.value)}
				placeholder="number of rows in piece"
				min={1}
				required
			/>
			<input
				className="submit-button"
				type="submit"
				value={`${state.isEdit ? 'Edit' : 'Add New'} Piece`}
				disabled={title.length === 0}
			/>
		</form>
	)
}
