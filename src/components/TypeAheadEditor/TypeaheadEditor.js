import React, { useState, useRef } from "react"

import { EditorState, Modifier } from "draft-js"

import Container from "./components/Container"
import Editor from "./components/Editor"

import createStateFromText from "./utils/createStateFromText"
import filterOptions from "./utils/filterOptions"
import normalizeSelectedIndex from "./utils/normalizeSelectedIndex"

const Dropdown = React.lazy(() => import("./components/Dropdown"))

const TypeaheadEditor = ({ dropdownOptions = [], value = "", onChange }) => {
	const [typeahead, setTypeAhead] = useState(null)
	const [editorState, setEditorState] = useState(createStateFromText(value))
	const editorRef = useRef(null)

	const useEditorState = editorState => {
		setEditorState(editorState)

		if (onChange) {
			const contentState = editorState.getCurrentContent()
			onChange(contentState.getPlainText())
		}
	}

	const handleTypeaheadReturn = (text, selectedIndex, selection) => {
		const filteredVariables = filterOptions(dropdownOptions, text.replace("{{", "").replace("}}", ""))
		const index = normalizeSelectedIndex(selectedIndex, filteredVariables.length)

		const contentState = editorState.getCurrentContent()

		const contentStateWithEntity = contentState.createEntity("VARIABLE", "SEGMENTED", {
			value: `{{${filterOptions[index]}}}`
		})

		const entityKey = contentStateWithEntity.getLastCreatedEntityKey()

		const contentStateWithReplacementText = Modifier.replaceText(
			contentState,
			selection,
			filteredVariables[index],
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
