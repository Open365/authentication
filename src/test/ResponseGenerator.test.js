/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var sinon = require('sinon'),
	assert = require('chai').assert;
var ResponseGenerator = require('../lib/login/ResponseGenerator');

suite('ResponseGenerator suite', function() {
	var sut, response403, responseValid;

	setup(function() {
		response403 = {
			status: 403
		};
		responseValid = {
			result: {
				success: true
			}
		};
		sut = new ResponseGenerator();
	});

	test('getValidCardResponse should return status 403 on false valid card', function() {
		var result = sut.getValidCardResponse(false);
		assert.deepEqual(result, response403);
	});

	test('getValidCardResponse should return valid response on true valid card', function() {
		var result = sut.getValidCardResponse(true);
		assert.deepEqual(result, responseValid);
	});
});
