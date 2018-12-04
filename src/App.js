import React, { useState } from "react"

import TypeaheadEditor from "./components/TypeAheadEditor/index.js"

import "antd/dist/antd.css"

const VARIABLES = ["event.name", "date", "donation.amount", "person.lastName", "image_url"]

const App = () => {
	const [inputValue, setInputValue] = useState("some value with {{event.name}} {{ invalid.variable }}")

	return (
		<React.Fragment>
			{inputValue}
			<TypeaheadEditor dropdownOptions={VARIABLES} value={inputValue} onChange={setInputValue} />
		</React.Fragment>
	)
}

export default App
