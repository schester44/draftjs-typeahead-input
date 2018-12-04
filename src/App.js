import React, { useState } from "react"

import TypeaheadEditor from "./components/TypeAheadEditor/index.js"

import { Icon } from "antd"
import "antd/dist/antd.css"

const VARIABLES = ["event.name", "date", "donation.amount", "person.lastName", "image_url"]

const trigger = "{{"
const App = () => {
	const [inputValue, setInputValue] = useState("some value with {{event.name}} {{ invalid.variable }}")

	return (
		<React.Fragment>
			<p style={{ margin: 25, fontSize: 14 }}>
				Accepts plain text, or trigger the type-ahead dropdown with the trigger word `{trigger}`
			</p>
			<div style={{ margin: 50 }}>
				<TypeaheadEditor
					dropdownOptions={VARIABLES}
					value={inputValue}
					onChange={setInputValue}
					triggerIcon={<Icon type="plus-circle" />}
				/>
			</div>
		</React.Fragment>
	)
}

export default App
