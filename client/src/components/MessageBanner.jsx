import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../App'
import './MessageBanner.scss'

export default function MessageBanner () {
	const context = useContext(GlobalContext)
	const { state, dispatch } = context
	const [ opacity, setOpacity ] = useState(0)

	useEffect(() => {
		if (state.message.length > 0) {
			setOpacity(100)
			setTimeout(() => {
				setOpacity(75)
				setTimeout(() => {
					setOpacity(50)
					setTimeout(() => {
						setOpacity(25)
						setTimeout(() => {
							setOpacity(0)
						}, 500)
					}, 500)
				}, 500)
			}, 5000)
		}
	}, [state.message])

	return (
		<header
			className="message-banner"
			style={{
				filter: `opacity(${opacity}%)`
			}}
		>
			{ state.message }
		</header>
	)
}