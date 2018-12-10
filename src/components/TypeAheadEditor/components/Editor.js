import React from "react"
import { Editor } from "draft-js"
import getTriggerRange from "../utils/getTriggerRange"
import getRange from "../utils/getRange"

class TypeaheadEditor extends Editor {
	constructor(props) {
		super(props)
		this.typeaheadState = null
	}

	hasEntityAtSelection() {
		const { editorState } = this.props

		const selection = editorState.getSelection()

		if (!selection.getHasFocus()) {
			return false
		}

		const contentState = editorState.getCurrentContent()
		const block = contentState.getBlockForKey(selection.getStartKey())
		return !!block.getEntityAt(selection.getStartOffset() - 1)
	}

	getTypeaheadState(invalidate = true, options = {}) {
		if (!invalidate) {
			return this.typeaheadState
		}

		const isTriggerClick = !!options.trigger
		const typeaheadRange = isTriggerClick ? getRange() : getTriggerRange("@")

		if (!typeaheadRange) {
			this.typeaheadState = null
			return null
		}

		if (!isTriggerClick) {
			const tempRange = window
				.getSelection()
				.getRangeAt(0)
				.cloneRange()

			tempRange.setStart(tempRange.startContainer, typeaheadRange.start)

			const rangeRect = tempRange.getBoundingClientRect()
			let [left, top] = [rangeRect.left, rangeRect.bottom]

			this.typeaheadState = {
				left,
				top,
				text: typeaheadRange.text,
				selectedIndex: 0
			}
		} else {
			const rect = this.triggerEl.getBoundingClientRect()

			this.typeaheadState = {
				top: rect.top + 30,
				left: rect.left,
				text: "",
				selectedIndex: 0
			}
		}

		return this.typeaheadState
	}

	onChange = editorState => {
		this.props.onChange(editorState)

		// Set typeahead visibility. Wait a frame to ensure that the cursor is updated.
		if (this.props.onTypeaheadChange) {
			window.requestAnimationFrame(() => {
				this.props.onTypeaheadChange(this.getTypeaheadState())
			})
		}
	}

	onEscape = e => {
		if (!this.getTypeaheadState(false)) {
			this.props.onEscape && this.props.onEscape(e)
			return
		}

		e.preventDefault()
		this.typeaheadState = null

		this.props.onTypeaheadChange && this.props.onTypeaheadChange(null)
	}

	onArrow(e, originalHandler, nudgeAmount) {
		let typeaheadState = this.getTypeaheadState(false)

		if (!typeaheadState) {
			originalHandler && originalHandler(e)
			return
		}

		e.preventDefault()

		typeaheadState.selectedIndex += nudgeAmount
		this.typeaheadState = typeaheadState

		this.props.onTypeaheadChange && this.props.onTypeaheadChange(typeaheadState)
	}

	onUpArrow = e => {
		this.onArrow(e, this.props.onUpArrow, -1)
	}

	onDownArrow = e => {
		this.onArrow(e, this.props.onDownArrow, 1)
	}

	handleReturn = e => {
		if (this.typeaheadState) {
			if (this.props.handleTypeaheadReturn) {
				const contentState = this.props.editorState.getCurrentContent()

				const selection = contentState.getSelectionAfter()

				const entitySelection = selection.set(
					"anchorOffset",
					selection.getFocusOffset() - this.typeaheadState.text.length
				)

				this.props.handleTypeaheadReturn(this.typeaheadState.text, this.typeaheadState.selectedIndex, entitySelection)
				this.typeaheadState = null
				this.props.onTypeaheadChange && this.props.onTypeaheadChange(null)
			} else {
				console.error(
					"Warning: A typeahead is showing and return was pressed but `handleTypeaheadReturn` isn't implemented."
				)
			}
			return true
		}
		return false
	}

	setTriggerRef = el => {
		this.triggerEl = el
	}

	onTriggerClick = e => {
		e.preventDefault()
		e.stopPropagation()

		if (this.props.onTypeaheadChange) {
			window.requestAnimationFrame(() => {
				this.props.onTypeaheadChange(this.getTypeaheadState(undefined, { trigger: true }))
			})
		}
	}

	setRef = el => {
		this.ee = el
	}

	render() {
		const { triggerIcon, onChange, onEscape, onUpArrow, onDownArrow, onTypeaheadChange, ...other } = this.props

		return (
			<div>
				{triggerIcon && (
					<div ref={this.setTriggerRef} className="trigger-icon" onClick={this.onTriggerClick}>
						{triggerIcon}
					</div>
				)}
				<Editor
					{...other}
					ref={this.setRef}
					stripPastedStyles={true}
					onChange={this.onChange}
					onEscape={this.onEscape}
					onUpArrow={this.onUpArrow}
					onDownArrow={this.onDownArrow}
					handleReturn={this.handleReturn}
				/>
			</div>
		)
	}
}

export default TypeaheadEditor
