const findAllPossibleVariables = (regex, block) => {
	const text = block.getText()
	let matchArr, start
	let ranges = []

	while ((matchArr = regex.exec(text)) !== null) {
		start = matchArr.index
		ranges.push({ start, end: start + matchArr[0].length, text: text.substring(start, start + matchArr[0].length) })
	}

	return ranges
}

export default findAllPossibleVariables
