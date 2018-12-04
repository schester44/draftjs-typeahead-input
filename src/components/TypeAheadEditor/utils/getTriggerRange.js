export default trigger => {
	const selection = window.getSelection()

	if (selection.rangeCount === 0) return null

	const range = selection.getRangeAt(0)
	const text = range.startContainer.textContent.substring(0, range.startOffset)
	const index = text.lastIndexOf(trigger)

	if (index === -1) return null

	return {
		text: text.substring(index),
		start: index,
		end: range.startOffset
	}
}
