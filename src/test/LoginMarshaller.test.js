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
var LoginMarshaller = require('../lib/login/LoginMarshaller');
var CredentialsFactory = require('../lib/login/CredentialsFactory');

suite('LoginMarshaller', function () {
	var credentialsFactory, credentialsFactoryMock
	var expGetCredentials;
	var sut;
	var TID = 'de305d54-75b4-431b-adb2-eb6b9e546013';
	var args = {
		document:'test',
		headers: {
			"X-eyeos-TID" : TID
		}
	};

	setup(function () {
		var fakeCredentials = {
			getAuthInfo: true
		};
		var pojo = {
			TID: TID,
			credentials: fakeCredentials
		}
		credentialsFactory = new CredentialsFactory();
		credentialsFactoryMock = sinon.mock(credentialsFactory);
		expGetCredentials = credentialsFactoryMock.expects('getCredentials').once().withExactArgs(args.document).returns(pojo);

		sut = new LoginMarshaller(credentialsFactory);
	});

	suite('#login', function () {
		test('should call CredentialsFactory.getCredentials method', function () {
			sut.login(args);
			expGetCredentials.verify();
		});
		
	});

	test('checkCard should return args', function() {
		var result = sut.checkCard(args);
		assert.equal(result, args);
	});

	test('renewCard should return args', function() {
		var result = sut.renewCard(args);
		assert.equal(result, args);
	});
});
