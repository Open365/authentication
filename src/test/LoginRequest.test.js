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

// Testing swag
var sinon = require('sinon');
var assert = require('chai').assert;

// Login service
var LoginRequest = require('../lib/login/LoginRequest');
var LoginMarshaller = require('../lib/login/LoginMarshaller');
var Login = require('../lib/login/Login');
var ProviderFactory = require('../lib/login/providers/ProviderFactory');
var loginCallFactory = require('../lib/login/loginCallFactory');
var Credentials = require('../lib/login/Credentials');
var DummyAuth = require('../lib/login/authinfo/DummyAuth');
var UsernameExtractor = require('../lib/login/UsernameExtractor');

// Request stuff
var RequestFilter = require('../lib/login/RequestFilter');

// Settings
var settings = require('../lib/settings-test');

suite('LoginRequest', function(){

	var sut, callback;
	var loginMarshaller, loginMarshallerMock, usernameExtractor, usernameExtractorMock;
	var login, loginMock, loginCallFactoryMock;
	var expLoginCalled, expLoginFactoryCall, expExtractorExtract;
	var requestFilter, requestFilterMock, expRequestFilter;
	var service = 'login', method = 'get', username = 'user1';
	var args = {
		type: 'Dummy',
		authInfo: {
			amIDummy: true
		}
	};
	var domain = 'eyeos.com';

	var request = {
		service: service,
		document: args,
		parameters: {
			methods: 'login'
		},
		headers: {
			Host: domain
		}
	};

	setup(function(){
		callback = function () {};
		var providerFactory = new ProviderFactory(settings);
		login = new Login(providerFactory, {});
		loginMarshaller = new LoginMarshaller();
		usernameExtractor = new UsernameExtractor();
		usernameExtractorMock = sinon.mock(usernameExtractor);
		loginCallFactoryMock = sinon.mock(loginCallFactory);
		loginMarshallerMock = sinon.mock(loginMarshaller);
		loginMock = sinon.mock(login);

		requestFilter = new RequestFilter({}, {});
		requestFilterMock = sinon.mock(requestFilter);

		sut = new LoginRequest(request, login, loginMarshaller, loginCallFactory, requestFilter, undefined, usernameExtractor);
	});

	suite('#send', function(){
		setup(function() {
			var credentials = new Credentials(new DummyAuth({username: 'username'}));
			var loginCall = {};
			expLoginCalled = loginMarshallerMock.expects('login').once().withExactArgs(request).returns(credentials);
			expLoginFactoryCall = loginCallFactoryMock.expects('getLoginCall')
														.once()
														.withExactArgs(service, callback, credentials, login)
														.returns(loginCall);
			expExtractorExtract = usernameExtractorMock.expects('extract')
				.once().withExactArgs(request).returns(username);
			expRequestFilter = requestFilterMock.expects('filter').once().withExactArgs(username, service, domain, sinon.match.object);
		});

		teardown(function () {
			loginCallFactoryMock.restore();
		});

		test('Should call LoginMarshaller.login', function(){
			sut.send(callback);
			expLoginCalled.verify();
		});
		test('Should call usernameExtractor extract', function() {
			sut.send(callback);
			expExtractorExtract.verify();
		});
		test('Should call LoginCallFactory.getLoginCall', function () {
			sut.send(callback);
			expLoginFactoryCall.verify();
		});
		test('Should call RequestFilter.filter with requestCall', function () {
			sut.send(callback);
			expRequestFilter.verify();
		});
	});

	suite('username case aware', function () {
		var testCases = [
			{ data: "fake username", expected: "fake username" },
			{ data: "Fake Username", expected: "fake username" },
			{ data: "FAKE USERNAME", expected: "fake username" }
		];

		var usernameCaseAwareTest = function (item) {
			var credentials = new Credentials(new DummyAuth({username: item.data}));
			var loginCall = {};
			expLoginCalled = loginMarshallerMock.expects('login').once().withExactArgs(request).returns(credentials);
			expLoginFactoryCall = loginCallFactoryMock.expects('getLoginCall')
														.once()
														.withExactArgs(service, callback, credentials, login)
														.returns(loginCall);
			expExtractorExtract = usernameExtractorMock.expects('extract')
				.once().withExactArgs(request).returns(item.data);
			expRequestFilter = requestFilterMock.expects('filter').once().withExactArgs(item.expected, service, domain, sinon.match.object);
		};

		teardown(function () {
			loginCallFactoryMock.restore();
		});

		testCases.forEach(function (item) {
			test("Calls to requestFilter.filter with username: " + item.data, function () {
				usernameCaseAwareTest(item);
				sut.send(callback);
				expRequestFilter.verify();
			});

			test("Calls to loginCallFactory.getLoginCall with username: " + item.data, function () {
				usernameCaseAwareTest(item);
				sut.send(callback);
				expLoginCalled.verify();
			});
		});
	});
});
