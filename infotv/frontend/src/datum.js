"use strict";
var _ = require("lodash");

module.exports = (function DatumManager() {
	var datums = {};
	return {
		update: function(data) {
			datums = _.extend(datums, data);
		},
		setValue: function(key, value) {
			return (datums[key] = {value: value, mtime: 0, virtual: true});
		},
		getValue: function(key, defaultValue) {
			var datum = datums[key];
			if(datum) {
				return datum.value;
			}
			return defaultValue;
		},
		getFull: function(key) {
			return datums[key] || undefined;
		}
	};
}());
