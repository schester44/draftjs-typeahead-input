import React, { useState, useEffect } from "react"

import { EditorState, Modifier, SelectionState, convertToRaw } from "draft-js"

import createStateFromText from "./utils/createStateFromText"
import filterOptions from "./utils/filterOptions"
import normalizeSelectedIndex from "./utils/normalizeSelectedIndex"
import findRangesWithRegex from "./utils/findRangesWithRegex"

import Dropdown from "./components/Dropdown"
import Container from "./components/Container"
import Editor from "./components/Editor"

const createEntity = (contentState, value) => contentState.createEntity("VARIABLE", "IMMUTABLE", { value })

const TypeaheadEditor = ({ dropdownOptions = [], value = "", onChange, triggerIcon }) => {
	const [typeahead, setTypeAhead] = useState(null)
	const [editorState, setEditorState] = useState(createStateFromText(value))

	// This effecet is responsible for styling variables and creating appropriate Entity's. It is only ran when the component is mounted
	useEffect(() => {
		const AT_REGEX = /{{([a-zA-z._]+)}}/g

		let nextEditorState = editorState
		const contentState = nextEditorState.getCurrentContent()

		contentState.getBlockMap().forEach((block, i) => {
			const blockKey = block.getKey()
			const ranges = findRangesWithRegex(AT_REGEX, block)

			ranges.forEach((range, i) => {
				const start = range.start
				const end = range.end

				// TODO: We're manually moving the SelectionState minus i*4, 4 being the total number of extra characters that will be removed ({{}}) to set the correct selection... this works, but its super hacky. We should be getting better ranges after each editorState update instead.
				const selection = new SelectionState({
					anchorKey: blockKey,
					anchorOffset: start - i * 4,
					focusKey: blockKey,
					focusOffset: end - i * 4
				})

				const entityKey = block.getEntityAt(start)

				if (entityKey === null) {
					const contentState = nextEditorState.getCurrentContent()

					const contentStateWithEntity = createEntity(contentState, range.text)

					const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

					const contentStateWithReplacementText = Modifier.replaceText(
						//get the current state
						contentState,
						//at this selection range
						selection,
						// replace the {{variable}} with text that does not include `{{}}`
						range.text.substring(2, range.text.length - 2),
						null,
						entityKey
					)

					nextEditorState = EditorState.push(nextEditorState, contentStateWithReplacementText, "apply-entity")
				}
			})
		})

		// finally, after all the changes have been made to the `nextEditorState`, we update the editorState.
		if (nextEditorState !== editorState) {
			useEditorState(nextEditorState)
		}
	}, [])

	const useEditorState = nextEditorState => {
		setEditorState(nextEditorState)

		if (onChange) {
			/**
			 * Map the variable entities back to their original location
			 * ex: donation.amount -> {{donation.amount}}
			 * we need to do this because contentState.getPlainText() doesn't return the variables (returns variables without the `{{}}` but we need those)
			 *
			 * TODO: is there a better, more efficient way to do this using the built in draft-js API?
			 *  */

			const raw = convertToRaw(nextEditorState.getCurrentContent())

			const text = raw.blocks.reduce((acc, el) => {
				if (el.entityRanges[0]) {
					let v = `${acc}${raw.entityMap[el.entityRanges[0].key].data.value}`

					// TODO: We need to do a string replacement here for the entities.. not it definitely doesn't seem correct
					return v
				}

				return `${acc}${el.text}`
			}, "")

			onChange(text)
		}
	}

	const handleTypeaheadReturn = (text, selectedIndex, selection) => {
		const filteredOptions = filterOptions(dropdownOptions, text.replace("@", ""))
		const index = normalizeSelectedIndex(selectedIndex, filteredOptions.length)

		// We shouldn't be doing any text replacement if the replacement text is undefined.
		// This will happen if the user presses Enter after searching for text that doesn't exist in the dropdownOptions
		if (!filteredOptions[index]) {
			return
		}

		const contentState = editorState.getCurrentContent()

		const contentStateWithEntity = contentState.createEntity("VARIABLE", "IMMUTABLE", {
			value: `{{${filteredOptions[index]}}}`
		})

		const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

		const contentStateWithReplacementText = Modifier.replaceText(
			editorState.getCurrentContent(),
			selection,
			filteredOptions[index],
			null,
			entityKey
		)

		const nextEditorState = EditorState.push(editorState, contentStateWithReplacementText, "apply-entity")

		useEditorState(nextEditorState)
	}

	const renderTypeahead = () => {
		if (typeahead === null) return null

		return (
			<Dropdown
				onSelect={selectedIndex => {
					const contentState = editorState.getCurrentContent()

					// TODO: There is a bug somewhere that causes the entitySelection offsets to be wrong which causes variables selected from the triggerIcon to be inserted in the middle of the string instead of at the end of the string. this is likely because the currentSelection is wrong -- SelectionState's are created in init (to style the existing variables)

					const selection = contentState.getSelectionAfter()
					const editorHasFocus = selection.getHasFocus()

					let entitySelection
					if (editorHasFocus) {
						entitySelection = selection.set("anchorOffset", selection.getFocusOffset())
					} else {
						// The editor doesn't have focus here so we get the length of the text, set the SelectionState to the end of the string and then do our thing. This inserts the variable at the end of the string.
						const textLength = contentState.getPlainText().length
						entitySelection = selection.set("focusOffset", textLength).set("anchorOffset", textLength)
					}

					handleTypeaheadReturn("", selectedIndex, entitySelection)
					setTypeAhead(null)
				}}
				options={dropdownOptions}
				{...typeahead}
			/>
		)
	}
	return (
		<Container>
			<React.Suspense fallback={<span />}>{renderTypeahead()}</React.Suspense>

			<div className="editor">
				<Editor
					triggerIcon={triggerIcon}
					editorState={editorState}
					onFocus={e => {
						const contentState = editorState.getCurrentContent()

						// const selectionState = SelectionState.createEmpty();
						// const selectionStateWithNewFocusOffset = selection.set('focusOffset', );

						// this.setState({ editorState: EditorState.forceSelection(contentState, selectionState) })
					}}
					onChange={useEditorState}
					onTypeaheadChange={t => {
						setTypeAhead(t)
					}}
					handleTypeaheadReturn={handleTypeaheadReturn}
				/>
			</div>
		</Container>
	)
}

export default TypeaheadEditor
