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

var sinon = require('sinon');
var assert = require('chai').assert;
var RequestFinished = require('../lib/ResponseFinisher');
var LoginFinishedUnsuccessCallback = require('../lib/login/LoginFinishedUnsuccessCallback');
var LoginResult = require('../lib/login/LoginResult');


suite('LoginFinishedUnsuccessCallback', function () {
	var sut;
	var requestFinished, requestFinishedMock;
	var expRequestEnd;

	setup(function () {
		requestFinished = new RequestFinished();
		requestFinishedMock = sinon.mock(requestFinished);
		sut = new LoginFinishedUnsuccessCallback(requestFinished, LoginResult.INVALID_CREDENTIALS);
	});

	suite('#reachedFinished', function () {
		test('Should call responseFinisher.end with status 429 if the request limit has been reached', function () {
			expRequestEnd = requestFinishedMock.expects('end').once().withExactArgs({status: 429});
			sut.reachedFinished(true);
			expRequestEnd.verify();
		});
		test('Should call responseFinisher.end with status 403 if the request limit hasn\'t been reached', function () {
			expRequestEnd = requestFinishedMock.expects('end').once().withExactArgs({status: 403});
			sut.reachedFinished(false);
			expRequestEnd.verify();
		});
	});
});