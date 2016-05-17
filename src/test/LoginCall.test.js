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

//Login
var Login = require('../lib/login/Login');
var LoginCall = require('../lib/login/LoginCall');

suite('LoginCall', function () {
	var sut, login;
	var loginMock, callbackMock;
	var args = {};
	var callback = {
		end: function() {}
	};
	var errorMsg = 'Max amount of swag';

	var service = 'login';
	var expCallbackEnd, expLoginCall;

	setup(function () {

		login = new Login();
		loginMock = sinon.mock(login);
		callbackMock = sinon.mock(callback);

		expLoginCall = loginMock.expects('login').once().withExactArgs(args, callback);
		expCallbackEnd = callbackMock.expects('end').once().withExactArgs(errorMsg);
		sut = new LoginCall(service, callback, args, login);
	});

	teardown(function() {
		callbackMock.restore();
	});

	suite('execute', function () {
		test('should call login service with correct arguments', function () {
			sut.execute();
			expLoginCall.verify();
		});
	});

	suite('discard', function () {
		test('should call callback.end with error message pass by argument', function () {
			sut.discard(errorMsg);
			expCallbackEnd.verify();
		});
	});
});
