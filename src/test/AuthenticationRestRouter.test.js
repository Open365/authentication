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
var DummyRequest = require('../lib/dummy/DummyRequest');
var RequestFactory = require('../lib/RequestFactory');

var AuthenticationRestRouter = require('../lib/AuthenticationRestRouter');

suite('AuthenticationRestRouter', function(){
	var sut;
	var requestFactory, requestFactoryMock;
	var dummyRequest, dummyRequestMock;
	var expGetRequest, expDummyRequestSend;
	var analyzedRequest = {
		service: 'dummy',
		headers: '',
		method: 'GET',
		parameters: {
			dummy: "func1",
		},
		document: {
			amIDummy: true
		}
	};

	var httpRequestMock;
	var httpRequest = {
		fail: function(){},
		invalidRequest: function(){}
	};

	setup(function(){
		dummyRequest = new DummyRequest();
		dummyRequestMock = sinon.mock(dummyRequest);
		httpRequestMock = sinon.mock(httpRequest);
		requestFactory = new RequestFactory();
		requestFactoryMock = sinon.mock(requestFactory);
		var argumentParams = {
			amIDummy: true
		};
		expGetRequest = requestFactoryMock.expects('getRequest').once().withExactArgs(analyzedRequest).returns(dummyRequest);
		expDummyRequestSend = dummyRequestMock.expects('send').once().withExactArgs(sinon.match.object);
		sut = new AuthenticationRestRouter(requestFactory);
	});

	suite('#dispatch', function(){
		test('should call RequestFactory.getRequest', function(){
			sut.dispatch(analyzedRequest, httpRequest);
			expGetRequest.verify();
		});
		test('should call the method send of the returned Request with callback', function () {
			sut.dispatch(analyzedRequest, httpRequest);
			expDummyRequestSend.verify();
		});
	});

	suite('#dispatch when fail', function(){
		var expHttpRequestInvalidRequest, expHttpRequestFail;
		setup(function() {
			requestFactoryMock.restore();
			expHttpRequestFail = httpRequestMock.expects('fail').once().withExactArgs(400, 'Hardcoded Exception');
			expHttpRequestInvalidRequest = httpRequestMock.expects('invalidRequest').once().withExactArgs(analyzedRequest);
		});

		teardown(function() {
			httpRequestMock.restore();
		});

		test('should call httpRequest.fail since we can not get the Request', function () {
			analyzedRequest.service = 'not existent';
			sut.dispatch(analyzedRequest, httpRequest);
			expHttpRequestInvalidRequest.verify();
		});

		test('should call httpRequest.fail if an exception is thrown within send', function () {
			analyzedRequest.service = 'anotherdummy'; //This service will throw an exception
			sut.dispatch(analyzedRequest, httpRequest);
			expHttpRequestFail.verify();
		});
	});
});
