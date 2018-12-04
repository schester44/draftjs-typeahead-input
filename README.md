# Typeahead Input Field

This package likely needs refactored before it will be useful to others.

The main purpose of this package, currently, is to render an ant design Input field with "variables" that are displayed as "pills". It uses draft-js to do the heavy lifting. The trigger word is `{{`, typing that will display a dropdown that has typeahead support for selecting one of the options passed to dropdownOptions

## Example

```js
const [inputValue, setInputValue] = useState("")
const VARIABLES = ["some", "options", "here"]

<TypeaheadEditor dropdownOptions={VARIABLES} value={inputValue} onChange={setInputValue} />
```
