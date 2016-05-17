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
var UsernameExtractor = require('../lib/login/UsernameExtractor');

suite('UsernameExtractor suite', function() {
	var sut, request, card = '{"username":"user2"}';

	setup(function() {
		sut = new UsernameExtractor();
	});

	function prepareRequest(method, injectedCard) {
		request = {
			parameters: {
				methods: method
			},
			document: {
				username: 'user1'
			},
			headers: {
				card: injectedCard
			}
		};
	}

	test('extract should return user1 on login method', function() {
		prepareRequest('login', card);
		var result = sut.extract(request);
		assert.equal(result, 'user1');
	});

	test('extract should return user2 on any other method', function() {
		prepareRequest('perico', card);
		var result = sut.extract(request);
		assert.equal(result, 'user2');
	});

	test('extract should return empty username on malformed JSON card', function() {
		prepareRequest('checkCard');
		var result = sut.extract(request);
		assert.equal(result, '');
	});
});
