const querystring = require("querystring");

const queryObjectKeyToString = (queryKey) => (
    Object.keys(querystring.parse(queryKey))[0]
);

module.exports = {queryObjectKeyToString};