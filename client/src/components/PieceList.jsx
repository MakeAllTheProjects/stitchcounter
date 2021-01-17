import React, { useContext } from 'react'
import { GlobalContext } from '../App'

import './PieceList.scss'

export default function PieceList() {
	const context = useContext(GlobalContext)
	const { state, dispatch } = context

	return (
		<section className="piece-list">
			<button className="add-piece">+ Add a Piece</button>
			{state.pieces.map(piece => (
				<article key={piece.id} className="piece-card">
					<p>{piece.title}</p>
				</article>
			))}
		</section>
	)
}
