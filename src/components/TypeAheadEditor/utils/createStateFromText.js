import { EditorState, ContentState, CompositeDecorator } from "draft-js"
import getEntityStrategy from "./getEntityStrategy"

import Pill from "../components/Pill"

export default (text, optionalDecorators = []) => {
	const decorators = new CompositeDecorator([
		{
			// This decorator is reponsible for styling newly created Entity's via the Typeahead methods
			strategy: getEntityStrategy("IMMUTABLE"),
			component: Pill
		},
		...optionalDecorators
	])

	return EditorState.createWithContent(ContentState.createFromText(text), decorators)
}
