import React from "react"
import styled from "styled-components"

import normalizeSelectedIndex from "../utils/normalizeSelectedIndex"
import filterOptions from "../utils/filterOptions"

const Container = styled("div")`
	position: fixed;
	background: white;

	font-family: Chinese Quote, -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB,
		Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
	font-size: 14px;
	font-variant: tabular-nums;
	line-height: 1.5;
	color: rgba(0, 0, 0, 0.65);
	margin: 0;
	padding: 0;
	list-style: none;
	z-index: 1050;
	display: block;

	${({ top, left }) =>
		`
		top: ${top}px;
		left: ${left}px;
	`}

	ul {
		outline: none;
		position: relative;
		list-style-type: none;
		padding: 4px 0;
		margin: 0;
		text-align: left;
		background-color: #fff;
		border-radius: 4px;
		-webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		background-clip: padding-box;

		li {
			padding: 5px 12px;
			margin: 0;
			clear: both;
			font-size: 14px;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.65);
			white-space: nowrap;
			cursor: pointer;
			-webkit-transition: all 0.3s;
			transition: all 0.3s;
			line-height: 22px;

			&:hover,
			&.active {
				background-color: #e6f7ff;
			}
		}
	}
`

export default ({ options = [], left, top, selectedIndex, text, onSelect }) => {
	const filteredOptions = filterOptions(options, text.replace("@", ""))
	const normalizedIndex = normalizeSelectedIndex(selectedIndex, filteredOptions.length)

	return (
		<Container left={left} top={top}>
			<ul>
				{filteredOptions.map((variable, index) => {
					return (
						<li
							key={index}
							onClick={e => {
								onSelect(index)
							}}
							className={index === normalizedIndex ? "active" : ""}
						>
							{variable}
						</li>
					)
				})}
			</ul>
		</Container>
	)
}
