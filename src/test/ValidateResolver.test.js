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
var Credentials = require('../lib/login/Credentials');
var Login = require('../lib/login/Login');
var ValidateResolver = require('../lib/login/captchaclient/ValidateResolver');
var ResponseFinisher = require('../lib/ResponseFinisher');

suite("ValidateResolver", function () {
	var sut, loginMock, credentials, responseFinisher, responseFinisherMock;
	setup(function () {
		var login = new Login();
		loginMock = sinon.mock(login);

		credentials = new Credentials();
		responseFinisher = new ResponseFinisher();
		responseFinisherMock = sinon.mock(responseFinisher);

		sut = new ValidateResolver(login, credentials, responseFinisher);
	});
	test("#done calls to login.login when response.result.success == true", function () {
		var exp = loginMock.expects('login').once().withExactArgs({credentials:credentials}, responseFinisher);
		sut.end({ result: { success: true }});
		exp.verify();
	});
	test("#done calls to responseFinisher.end when response.result.success == false", function () {
		var response = { result: { success: false }},
			exp = responseFinisherMock.expects('end').once().withExactArgs({ result: "MAX_ATTEMPS", status: 429 });
		sut.end(response);
		exp.verify();
	});
});
