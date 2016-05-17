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

'use strict';

var sinon = require('sinon');
var assert = require('chai').assert;
var RequestMeter = require('../lib/login/RequestMeter');
var LoginCallback = require('../lib/login/LoginCallback');
var RequestLimit = require('../lib/login/RequestLimit');
var ResponseFinisher = require('../lib/ResponseFinisher');
var LoginResult = require('../lib/login/LoginResult');
var UserNotificator = require('../lib/UserNotificator');

suite('LoginCallback', function(){
	var sut;
	var user, userId = 'Userid23';
	var expSuccessfulLogin, expIncorrectCredentials, expNetworkError;
	var userNotificatorSendStub;
	var tid = '550e8400-e29b-41d4-a716-446655440000';

	setup(function(){
		var loginResultHandler = {
			success: function(){},
			invalidCredentials: function(){},
			error: function(){}
		};

        user = {
            principalId: userId,
            permissions: []
        };

		var userNotificator = new UserNotificator({});
		userNotificatorSendStub = sinon.stub(userNotificator, 'sendLoginSuccess');

		var loginResultHandlerMock = sinon.mock(loginResultHandler);
		sut = new LoginCallback(loginResultHandler, tid, userNotificator);

		expSuccessfulLogin = loginResultHandlerMock.expects('success').once().withExactArgs(user);
		expIncorrectCredentials = loginResultHandlerMock.expects('invalidCredentials').once().withExactArgs(sinon.match({status: 403}), tid);
		expNetworkError = loginResultHandlerMock.expects('error').once().withExactArgs(sinon.match({status:503}));
	});

	suite('#loginFinished', function(){
		test('Should call LoginResultHandler.success if login is successful', function(){
			sut.loginFinished(null, user);
            expSuccessfulLogin.verify();
		});

        test('Should call LoginResultHandler.invalidCredentials if password or username is invalid', function(){
			sut.loginFinished(LoginResult.INVALID_CREDENTIALS);

			expIncorrectCredentials.verify();
		});

		test('Should call LoginResultHandler.error if a network error is encountered', function() {
			sut.loginFinished(LoginResult.CONNECTION_ERROR);

			expNetworkError.verify();
		});

		test('Should call userNotificator.send with correct parameters', function(){
			sut.loginFinished(null, user);
			assert(userNotificatorSendStub.calledWithExactly(userId, tid));
		});
	});
});
