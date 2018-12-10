const path = require("path")

module.exports = {
	mode: "production",
	entry: "./src/components/TypeAheadEditor/TypeaheadEditor.js",
	output: {
		path: path.resolve("lib"),
		filename: "index.js",
		libraryTarget: "commonjs2"
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules)/,
				use: "babel-loader"
			}
		]
	}
}
