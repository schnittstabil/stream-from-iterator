'use strict';

function iteratorFromArray(array, throwErrorOnIndex) {
	var i = 0;

	return {
		next: function () {
			if (i === throwErrorOnIndex) {
				throw new Error('index: ' + i++);
			}
			return i < array.length ?
				{value: array[i++], done: false} :
				{done: true};
		}
	};
}

module.exports = iteratorFromArray;
