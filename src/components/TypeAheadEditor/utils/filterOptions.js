export default (options, query) => options.filter(option => option.toLowerCase().startsWith(query.toLowerCase()))
