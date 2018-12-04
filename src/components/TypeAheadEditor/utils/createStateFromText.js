import { EditorState, ContentState, CompositeDecorator } from "draft-js"
import getEntityStrategy from "./getEntityStrategy"

import Pill from "../components/Pill"

export default (text, optionalDecorators = []) => {
	const decorators = new CompositeDecorator([
		{
			strategy: getEntityStrategy("SEGMENTED"),
			component: Pill
		},
		...optionalDecorators
	])

	return EditorState.createWithContent(ContentState.createFromText(text), decorators)
}
