const path = require("path")

module.exports = {
	mode: "production",
	entry: "./src/components/TypeAheadEditor/TypeaheadEditor.js",
	output: {
		path: path.resolve("dist"),
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
	},
	externals: {
		react: "commonjs react" // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
	}
}
