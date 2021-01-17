import React, { useContext } from 'react'
import { GlobalContext } from '../App'

import './PieceList.scss'

export default function PieceList() {
	const context = useContext(GlobalContext)
	const { state, dispatch } = context

	return (
		<section className="piece-list">
			<button
				className="add-piece"
				onClick={() => dispatch({
					type: 'TOGGLE_FORM',
					payload: { isEdit: false }
				})}
			>
				+ Add a Piece
			</button>
			{state.pieces.map(piece => {
				return (
					<article
						key={piece.id}
						className={ state.currentPiece === piece.id ? "piece-card selected" : "piece-card" }
						onClick={() => dispatch({ 
							type: 'SELECT_PIECE',
							payload: { selectedPiece: piece.id }
						})}
					>
						<h3>{piece.title}</h3> 
						<p>{piece.qtyMade}/{piece.qtyNeeded} ( {(piece.currentCount / piece.totalRowCount) * 100}% COMPLETE )</p>
					</article>
				)
			})}
		</section>
	)
}
