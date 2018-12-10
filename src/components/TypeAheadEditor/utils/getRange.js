export default () => {
	const selection = window.getSelection()

    console.log(selection);
	if (selection.rangeCount === 0) return null

	const range = selection.getRangeAt(0)

    console.log(range);
	return {
		text: "",
		start: range.startOffset,
		end: range.startOffset
	}
}
