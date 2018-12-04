import { EditorState, ContentState, CompositeDecorator } from "draft-js"
import getEntityStrategy from "./getEntityStrategy"

import Pill from "../components/Pill"

// const findAllPossibleVariables = (content, contentState, regex, callback) => {
// 	const text = content.getText()
// 	let matchArr, start

// 	while ((matchArr = regex.exec(text)) !== null) {
// 		start = matchArr.index

// 		callback(start, start + matchArr[0].length)
// 	}
// }

export default (text, optionalDecorators = []) => {
	const decorators = new CompositeDecorator([
		{
			// This decorator is reponsible for styling newly created Entity's via the Typeahead methods
			strategy: getEntityStrategy("IMMUTABLE"),
			component: Pill
		},
		// {
		// 	// This decorator is reponsible for styling existing variables already in the text
		// 	strategy: (contentBlock, callback, contentState) =>
		// 		findAllPossibleVariables(contentBlock, contentState, new RegExp(/{{([a-zA-z._]+)}}/, "g"), callback),

		// 	component: Pill
		// },
		...optionalDecorators
	])

	return EditorState.createWithContent(ContentState.createFromText(text), decorators)
}
