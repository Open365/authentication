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
var RenewCardCallback = require('../lib/login/RenewCardCallback'),
	ResponseFinisher = require('../lib/ResponseFinisher');

suite('RenewCardCallback suite', function() {
	var sut, responseFinisher, responseFinisherMock, expected, card, signature;
	var expResponseFinisherEnd;

	setup(function() {
		card = {
			username: 'user1',
			expiration: 3600
		};
		signature = 's7gh0s7ghf09shgf';
		expected = {
			result: {
				success: true,
				card:card,
				signature:signature,
				minicard: card,
				minisignature: signature
			}
		};
		responseFinisher = new ResponseFinisher();
		responseFinisherMock = sinon.mock(responseFinisher);
		sut = new RenewCardCallback(responseFinisher);
		expResponseFinisherEnd = responseFinisherMock.expects('end')
			.once().withExactArgs(expected);
	});

	test('signed should call responseFinisher end with correct params', function() {
		sut.signed(card, signature, card, signature);
		expResponseFinisherEnd.verify();
	});
});
