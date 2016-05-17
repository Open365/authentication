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

var settings = require('../lib/settings-test');
var LoginCall = require('../lib/login/LoginCall');
var RequestFilterCallback = require('../lib/login/RequestFilterCallback');
var RequestLimitReachedCallback = require('../lib/login/RequestLimitReachedCallback');

suite('RequestLimitReachedCallback', function () {
	var sut;
	var request, requestMock;
	var expRequestFilterFinishedTrue, expRequestFilterFinishedFalse;

	setup(function () {
		var service = 'dummy';

		request = new RequestFilterCallback(service);
		requestMock = sinon.mock(request);


		sut = new RequestLimitReachedCallback(service, request, settings);
	});

	suite('gotRequest', function () {
		test('Should call reachedFinished with false since request are less than allowed in settings', function () {
			expRequestFilterFinishedTrue = requestMock.expects('reachedFinished').once().withExactArgs(false);
			sut.gotRequest(1);
			expRequestFilterFinishedTrue.verify();
		});

		test('Should call reachedFinished with true if the amount of already done request are greater than in settings', function () {
			expRequestFilterFinishedFalse = requestMock.expects('reachedFinished').once().withExactArgs(true);
			sut.gotRequest(900);
			expRequestFilterFinishedFalse.verify();
		});
	});
});