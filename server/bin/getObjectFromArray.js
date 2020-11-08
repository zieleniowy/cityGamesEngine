const R = require('ramda');
const Either = require('./either');
module.exports = (prop, arr)=>objectOrString=>Either.fromNullable(typeof objectOrString === "string"?R.find(R.propEq(prop, objectOrString), arr):R.find(R.propEq(prop, R.prop(prop, objectOrString)), arr));