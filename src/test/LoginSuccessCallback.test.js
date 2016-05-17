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

/**
 * Created by eyeos on 16/02/15.
 */

var sinon = require('sinon');
var ResponseFinisher = require('../lib/ResponseFinisher');
var EyeosAuth = require('eyeos-auth');
var CredentialsFactory = require('../lib/login/CredentialsFactory');

var LoginSuccessCallback = require('../lib/login/LoginSuccessCallback');

suite("#LoginSuccessCallback", function() {

	var eyeosAuth, eyeosAuthMock,
		responseFinisher, responseFinisherMock;

	var credentialsFactory, credentials, principal;
	var userId;
	var expEyeosAuthSign;

	var sut;

	setup(function() {

		responseFinisher = new ResponseFinisher();
		responseFinisherMock = sinon.mock(responseFinisher);
		eyeosAuth = new EyeosAuth(responseFinisher);
		eyeosAuthMock = sinon.mock(eyeosAuth);
		credentialsFactory = new CredentialsFactory;
		var userId = "the principal id";

		credentials = credentialsFactory.getCredentials({type: "Basic", username: userId, password: "A password"});

		principal = {
			principalId: userId,
			permissions: []
		}
		sut = new LoginSuccessCallback(credentials, responseFinisher, eyeosAuth);
		expEyeosAuthSign = eyeosAuthMock.expects('signCardForPrincipal').once().withExactArgs(principal, sinon.match.object);

	});

	test('Should call EyeosAuth.signCardforPrincipal if login is successful', function() {
		sut.success(null, principal);
		expEyeosAuthSign.verify();
	});
});
