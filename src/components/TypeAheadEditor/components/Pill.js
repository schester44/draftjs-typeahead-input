import * as React from "react"

import Container from "./PillContainer"

const Pill = props => {
	return <Container>{props.children[0]}</Container>
}

export default Pill
