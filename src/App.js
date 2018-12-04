import React, { useState } from "react"

import TypeaheadEditor from "./components/TypeAheadEditor/index.js"

import "antd/dist/antd.css"

const VARIABLES = ["event.name", "date", "donation.amount", "person.lastName", "image_url"]

/**
 *  TODO:
 *
 *  1. This only works with the first variable.. variables deeper in the string are not selected
 *  2. Dropdown onClick isn't firing
 *  3. The `{{` and `}}` are being replaced, likely from within the `handleTypeaheadReturn` --- need to keep the `{{}}` data somehow.
 *  4. Styling isn't being ran on initialization...
 */

const App = () => {
	const [inputValue, setInputValue] = useState("")

	console.log({ inputValue })
	return (
		<TypeaheadEditor
			dropdownOptions={VARIABLES}
			value={inputValue}
			onChange={value => {
				setInputValue(value)
				// get value?
			}}
		/>
	)
}

export default App
