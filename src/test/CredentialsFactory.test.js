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
var CredentialsFactory = require('../lib/login/CredentialsFactory');
var authInfoFactory = require('../lib/login/authinfo/AuthInfoFactory');
var DummyAuth = require('../lib/login/authinfo/DummyAuth');


suite('CredentialsFactory', function () {
	var authInfoFactoryMock;
	var sut, expGetAuthInfo;
	var args = {
		type: 'Dummy',
		authInfo: {
			username: 'username',
			amIDummy: true
		}
	};

	setup(function () {
		var dummyAuth = new DummyAuth(args.authInfo);
		authInfoFactoryMock = sinon.mock(authInfoFactory);
		expGetAuthInfo = authInfoFactoryMock.expects('getAuthInfo').once().withExactArgs(args).returns(dummyAuth);
		sut = new CredentialsFactory(authInfoFactory);
	});

	teardown(function () {
		authInfoFactoryMock.restore();
	});

	suite('getCredentials', function () {
		test('should return a credentials object', function () {
			var credentials = sut.getCredentials(args);
			assert.ok(credentials.getAuthInfo);
		});

		test('should call authInfoFactory.getAuthInfo once', function () {
			sut.getCredentials(args);
			expGetAuthInfo.verify();
		});

		test('should return a Credentials object with a Dummy authInfo', function () {
			var credentials = sut.getCredentials(args);
			var authInfo = credentials.getAuthInfo();
			assert.equal(authInfo.getAmIDummy(), true);
		});
	});
});