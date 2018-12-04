import React, { useState, useRef, useEffect } from "react"

import { EditorState, Modifier, SelectionState, convertToRaw } from "draft-js"

import createStateFromText from "./utils/createStateFromText"
import filterOptions from "./utils/filterOptions"
import normalizeSelectedIndex from "./utils/normalizeSelectedIndex"
import findRangesWithRegex from "./utils/findRangesWithRegex"

import Dropdown from "./components/Dropdown"
import Container from "./components/Container"
import Editor from "./components/Editor"

const createEntity = (contentState, value) => contentState.createEntity("VARIABLE", "IMMUTABLE", { value })

const TypeaheadEditor = ({ dropdownOptions = [], value = "", onChange }) => {
	const [typeahead, setTypeAhead] = useState(null)
	const [editorState, setEditorState] = useState(createStateFromText(value))
	const editorRef = useRef(null)

	// This effecet is responsible for styling variables and creating appropriate Entity's. It is only ran when the component is mounted
	useEffect(() => {
		const AT_REGEX = /{{([a-zA-z._]+)}}/g

		const contentState = editorState.getCurrentContent()

		contentState.getBlockMap().forEach((block, i) => {
			const blockKey = block.getKey()
			const ranges = findRangesWithRegex(AT_REGEX, block)

			ranges.forEach((range, i) => {
				const start = range.start
				const end = range.end

				const selection = new SelectionState({
					anchorKey: blockKey,
					anchorOffset: start,
					focusKey: blockKey,
					focusOffset: end
				})

				const entityKey = block.getEntityAt(start)
				if (entityKey === null) {
					const contentStateWithEntity = createEntity(contentState, range.text)

					const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

					const contentStateWithReplacementText = Modifier.replaceText(
						editorState.getCurrentContent(),
						selection,
						// replace hte {{variable}} with text that does not include `{{}}`
						range.text.substring(2, range.text.length - 2),
						null,
						entityKey
					)

					const nextEditorState = EditorState.push(editorState, contentStateWithReplacementText, "apply-entity")

					if (nextEditorState !== editorState) {
						useEditorState(nextEditorState)
					}
				}
			})
		})
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
		const filteredOptions = filterOptions(dropdownOptions, text.replace("{{", "").replace("}}", ""))
		const index = normalizeSelectedIndex(selectedIndex, filteredOptions.length)

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

		return <Dropdown options={dropdownOptions} {...typeahead} />
	}
	return (
		<Container>
			<React.Suspense fallback={<span />}>{renderTypeahead()}</React.Suspense>
			<div className="editor">
				<Editor
					ref={editorRef}
					editorState={editorState}
					onChange={useEditorState}
					onTypeaheadChange={setTypeAhead}
					handleTypeaheadReturn={handleTypeaheadReturn}
				/>
			</div>
		</Container>
	)
}

export default TypeaheadEditor
