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

var sinon = require('sinon'),
	assert = require('chai').assert;
var LoginSignCardCallback = require('../lib/login/LoginSignCardCallback');

suite('LoginSignCardCallback suite', function() {
	var sut, responseFinisherFake, responseFinisherMock,
		card, signature, result, fail;
	var expResponseEnd, expResponseFail, expPostProcessor;
    var credentialsFactory, credentials;
    var successfulLoginPostProcessorFake, successfulLoginPostProcessorMock;

	setup(function() {
		card = {
			'username': 'user1',
			'expiration': 3600
		};
        var CredentialsFactory = require("../lib/login/CredentialsFactory");
        credentialsFactory = new CredentialsFactory();
        credentials = credentialsFactory.getCredentials({type: "Basic", username: "An Username", password: "A password"})

        signature = 'sd68fg0sd76gs7df6g';
		principalFake = {
			'principalId': 'principalid',
			'firstname': 'john',
			'lastname': 'doe'
		};
		fail = {
			status: 403
		};
		result = {
			success: true,
			card: card,
			signature: signature,
			minicard: card,
			minisignature: signature
		};
		responseFinisherFake = {
			end: function() {}
		};
        successfulLoginPostProcessorFake = {
            success: function() {}
        };

		responseFinisherMock = sinon.mock(responseFinisherFake);
        successfulLoginPostProcessorMock = sinon.mock(successfulLoginPostProcessorFake);
		sut = new LoginSignCardCallback(credentials, responseFinisherFake, principalFake, successfulLoginPostProcessorFake);
		expResponseEnd = responseFinisherMock.expects('end').once().withExactArgs({result:result});
		expResponseFail = responseFinisherMock.expects('end').once().withExactArgs(fail);
        expPostProcessor = successfulLoginPostProcessorMock.expects('success').once().withExactArgs("an username", "A password", card, signature, principalFake);
	});

	test('signed should call responseFinisher end with result', function() {
		sut.signed(card, signature, card, signature);
		expResponseEnd.verify();
	});
    test('signed should call successfulLoginPostProcessor success with result', function() {
        sut.signed(card, signature, card, signature);
        expPostProcessor.verify();
    });

	test('unSigned should call responseFinisher end with status 403', function() {
		sut.unSigned();
		expResponseFail.verify();
	});
});
