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
var chai = require('chai');
var Login = require('../lib/login/Login.js');
var DummyProvider = require('../lib/login/providers/dummy/DummyProvider');
var Credentials = require('../lib/login/Credentials');
var DummyCaptchaClient = require('./utils/DummyCaptchaClient');
var EyeosAuth = require('eyeos-auth');
var ResponseGenerator = require('../lib/login/ResponseGenerator');

suite('Login', function(){
	var sut, loginProviderMock, captchaClientMock, eyeosAuth, eyeosAuthMock, requestFinisher, requestFinisherMock,
		responseGenerator, responseGeneratorMock, args = {}, validCard = true, response = {};
	var expLogintoLogin, validateExp, expEyeosAuthVerify, expResponseGenerator,
		expRequestFinisherEnd, expEyeosAuthRenew;

	var username = 'username',
		fakeId = 'fake id',
		fakeText = 'fake text';

	var credentials = new Credentials({
		getUsername: function(){return username;},
		getCaptchaId: function(){return fakeId;},
		getCaptchaText: function(){return fakeText;}
	});

	var pojo = {
		credentials: credentials,
		TID: ''
	};

	setup(function(){
		requestFinisher = {
			end: function() {}
		};
		requestFinisherMock = sinon.mock(requestFinisher);
		var provider = new DummyProvider();
		var fakeProviderFactory = {
			getProvider: function() {
				return provider;
			}
		};
		loginProviderMock = sinon.mock(provider);

		var captchaClient = new DummyCaptchaClient();
		var captchaClientFactory = {
			getCaptchaClient: function() {
				return captchaClient;
			}
		};
		captchaClientMock = sinon.mock(captchaClient);

		eyeosAuth = new EyeosAuth();
		eyeosAuthMock = sinon.mock(eyeosAuth);

		responseGenerator = new ResponseGenerator();
		responseGeneratorMock = sinon.mock(responseGenerator);

		sut = new Login(fakeProviderFactory, captchaClientFactory, eyeosAuth, responseGenerator);
	});

	function setCheckCardExpectations() {
		expEyeosAuthVerify = eyeosAuthMock.expects('verifyRequest')
			.once().withExactArgs(args).returns(validCard);
		expResponseGenerator = responseGeneratorMock.expects('getValidCardResponse')
			.once().withExactArgs(validCard).returns(response);
		expRequestFinisherEnd = requestFinisherMock.expects('end')
			.once().withExactArgs(response);
	}

	suite('#login', function(){
		test('It should call a provider login method with the given credentials', function(){
			expLogintoLogin = loginProviderMock.expects('login').withExactArgs(credentials, sinon.match.object);
			sut.login(pojo, requestFinisher, {});
			expLogintoLogin.verify();
		});
	});

	suite("#loginCaptcha", function () {
		test("test calls to captchaClient.validate", function () {
			validateExp = captchaClientMock.expects('validate').once().withExactArgs(credentials, sinon.match.object);
			sut.loginCaptcha(credentials, requestFinisher);
			validateExp.verify();
		});
	});

	suite('#checkCard', function() {
		test('should call eyeosAuth verifyRequest', function() {
			setCheckCardExpectations();
			sut.checkCard(args, requestFinisher);
			expEyeosAuthVerify.verify();
		});

		test('should call responseGenerator getValidCardResponse', function() {
			setCheckCardExpectations();
			sut.checkCard(args, requestFinisher);
			expResponseGenerator.verify();
		});

		test('should call requestFinisher end with response', function() {
			setCheckCardExpectations();
			sut.checkCard(args, requestFinisher);
			expRequestFinisherEnd.verify();
		});
	});

	suite('#renewCard', function() {
		test('should call eyeosAuth renewCard', function() {
			expEyeosAuthRenew = eyeosAuthMock.expects('renewCard')
				.once().withExactArgs(args, sinon.match.object);
			sut.renewCard(args, requestFinisher);
			expEyeosAuthRenew.verify();
		});
	});
});
