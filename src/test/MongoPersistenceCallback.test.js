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

var MongoPersistenceCallback = require('../lib/login/persistence/mongo/MongoPersistenceCallback');
var RequestLimitReachedCallback = require('../lib/login/RequestLimitReachedCallback');

suite('MongoPersistenceCallback', function(){
	var sut;

	var requestLimitReachedCallback, requestLimitReachedCallbackMock;
	var expGotRequest;

	setup(function(){
		requestLimitReachedCallback = new RequestLimitReachedCallback({}, settings);
		requestLimitReachedCallbackMock = sinon.mock(requestLimitReachedCallback);

		sut = new MongoPersistenceCallback(requestLimitReachedCallback);
	});

	suite('#requestFetched', function(){
		test('should call callbackObject.gotRequest', function(){
 			var expGotRequest = requestLimitReachedCallbackMock.expects('gotRequest').once();
			sut.requestFetched(new Error(), null);
			expGotRequest.verify();
		});
		test('If err is not null, it should call gotRequest with 0 (indicating 0 requests)', function () {
			var expGotRequest = requestLimitReachedCallbackMock.expects('gotRequest').once().withExactArgs(0);
			sut.requestFetched(new Error(), null);
			expGotRequest.verify();
		});
		test('If result is not null (and error is), gotRequest should we call with result.request', function () {
			var numOfRequests = 5;
			var expGotRequest = requestLimitReachedCallbackMock.expects('gotRequest').once().withExactArgs(5);
			sut.requestFetched(null, {request: 5});
			expGotRequest.verify();
		});
	});
});
