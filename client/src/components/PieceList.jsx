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
			{state.pieces.map((piece, i) => {
				return (
					<article
						key={piece.id}
						className={ state.currentPiece === i ? "piece-card selected" : "piece-card" }
						onClick={() => dispatch({ 
							type: 'SELECT_PIECE',
							payload: { selectedPiece: i }
						})}
					>
						<h3>{piece.title}</h3> 
						<p>{piece.qtyMade}/{piece.qtyNeeded} ( {(piece.currentCount / piece.totalRowCount) * 100}% COMPLETE )</p>
					</article>
				)
			})}
			<button
				className="reset-pieces"
				onClick={() => dispatch({
					type: 'RESET_ALL_PIECES'
				})}
			>
				Reset All Piece
			</button>
			<button
				className="delete-all"
				onClick={() => dispatch({
					type: 'DELETE_ALL_PIECES'
				})}
			>
				Delete All Piece
			</button>
		</section>
	)
}
